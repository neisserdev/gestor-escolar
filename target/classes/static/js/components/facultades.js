// Variables para facultades
let facultades = [];
let facultadEditando = null;

// Cargar facultades
async function cargarFacultades() {
    try {
        facultades = await FacultadService.listarTodas();
        renderizarFacultades();
    } catch (error) {
        console.error('Error al cargar facultades:', error);
        mostrarAlerta('Error al cargar las facultades', 'error');
    }
}

// Renderizar tabla de facultades
function renderizarFacultades() {
    const tbody = document.getElementById('facultades-tbody');

    if (!facultades || facultades.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                    No hay facultades registradas
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = facultades.map(facultad => `
        <tr>
            <td>${facultad.id}</td>
            <td>
                <strong>${facultad.nombreFacultad}</strong>
            </td>
            <td>
                <div class="action-buttons">
                    ${crearBotonAccion('Editar', 'fa-edit', 'btn-secondary', `editarFacultad(${facultad.id})`)}
                    ${crearBotonAccion('Eliminar', 'fa-trash', 'btn-danger', `eliminarFacultad(${facultad.id})`)}
                </div>
            </td>
        </tr>
    `).join('');
}

// Abrir modal para nueva facultad
function abrirModalFacultad() {
    facultadEditando = null;
    const contenido = `
        <form onsubmit="guardarFacultad(event)">
            <div class="form-group">
                <label for="nombreFacultad">Nombre de la Facultad *</label>
                <input type="text" id="nombreFacultad" name="nombreFacultad" required
                       placeholder="Ej: Facultad de Ingeniería">
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="cerrarModal()">
                    <i class="fas fa-times"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Guardar
                </button>
            </div>
        </form>
    `;

    abrirModal('Nueva Facultad', contenido);

    // Focus en el primer campo
    setTimeout(() => {
        document.getElementById('nombreFacultad').focus();
    }, 100);
}

// Editar facultad
async function editarFacultad(id) {
    try {
        facultadEditando = await FacultadService.obtenerPorId(id);

        const contenido = `
            <form onsubmit="guardarFacultad(event)">
                <div class="form-group">
                    <label for="nombreFacultad">Nombre de la Facultad *</label>
                    <input type="text" id="nombreFacultad" name="nombreFacultad" required
                           value="${facultadEditando.nombreFacultad}"
                           placeholder="Ej: Facultad de Ingeniería">
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="cerrarModal()">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Actualizar
                    </button>
                </div>
            </form>
        `;

        abrirModal('Editar Facultad', contenido);

        // Focus en el primer campo
        setTimeout(() => {
            document.getElementById('nombreFacultad').focus();
            document.getElementById('nombreFacultad').select();
        }, 100);

    } catch (error) {
        console.error('Error al obtener facultad:', error);
        mostrarAlerta('Error al obtener los datos de la facultad', 'error');
    }
}

// Guardar facultad (crear o actualizar)
async function guardarFacultad(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const facultadData = {
        nombreFacultad: formData.get('nombreFacultad').trim()
    };

    // Validaciones
    if (!facultadData.nombreFacultad) {
        mostrarAlerta('El nombre de la facultad es obligatorio', 'error');
        return;
    }

    try {
        if (facultadEditando) {
            // Actualizar
            await FacultadService.actualizar(facultadEditando.id, facultadData);
            mostrarAlerta('Facultad actualizada correctamente', 'success');
        } else {
            // Crear
            await FacultadService.crear(facultadData);
            mostrarAlerta('Facultad creada correctamente', 'success');
        }

        cerrarModal();
        await cargarFacultades();

    } catch (error) {
        console.error('Error al guardar facultad:', error);
        mostrarAlerta('Error al guardar la facultad', 'error');
    }
}

// Eliminar facultad
async function eliminarFacultad(id) {
    const facultad = facultades.find(f => f.id === id);
    if (!facultad) return;

    confirmarEliminacion(`la facultad "${facultad.nombreFacultad}"`, async () => {
        try {
            await FacultadService.eliminar(id);
            mostrarAlerta('Facultad eliminada correctamente', 'success');
            await cargarFacultades();
        } catch (error) {
            console.error('Error al eliminar facultad:', error);
            mostrarAlerta('Error al eliminar la facultad', 'error');
        }
    });
}