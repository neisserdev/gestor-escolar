// Variables para carreras
let carreras = [];
let carreraEditando = null;
let facultadesDisponibles = [];

// Cargar carreras
async function cargarCarreras() {
    try {
        carreras = await CarreraService.listarTodas();
        renderizarCarreras();
    } catch (error) {
        console.error('Error al cargar carreras:', error);
        mostrarAlerta('Error al cargar las carreras', 'error');
    }
}

// Cargar filtro de facultades
async function cargarFiltroFacultades() {
    try {
        facultadesDisponibles = await FacultadService.listarTodas();
        const select = document.getElementById('filtro-facultad-carreras');

        select.innerHTML = '<option value="">Todas las Facultades</option>' +
            facultadesDisponibles.map(f =>
                `<option value="${f.id}">${f.nombreFacultad}</option>`
            ).join('');
    } catch (error) {
        console.error('Error al cargar facultades:', error);
    }
}

// Filtrar carreras por facultad
async function filtrarCarrerasPorFacultad() {
    const facultadId = document.getElementById('filtro-facultad-carreras').value;

    try {
        if (facultadId) {
            carreras = await CarreraService.obtenerPorFacultad(facultadId);
        } else {
            carreras = await CarreraService.listarTodas();
        }
        renderizarCarreras();
    } catch (error) {
        console.error('Error al filtrar carreras:', error);
        mostrarAlerta('Error al filtrar las carreras', 'error');
    }
}

// Renderizar tabla de carreras
function renderizarCarreras() {
    const tbody = document.getElementById('carreras-tbody');

    if (!carreras || carreras.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                    No hay carreras registradas
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = carreras.map(carrera => `
        <tr>
            <td>${carrera.id}</td>
            <td>
                <strong>${carrera.nombreCarrera}</strong>
            </td>
            <td>
                ${carrera.facultad ?
                    `<span class="badge">${carrera.facultad.nombreFacultad}</span>` :
                    '<span style="color: var(--warning-color);">Sin asignar</span>'
                }
            </td>
            <td>
                <div class="action-buttons">
                    ${!carrera.facultad ?
                        crearBotonAccion('Asignar', 'fa-link', 'btn-success', `asignarFacultadACarrera(${carrera.id})`) : ''
                    }
                    ${crearBotonAccion('Editar', 'fa-edit', 'btn-secondary', `editarCarrera(${carrera.id})`)}
                    ${crearBotonAccion('Eliminar', 'fa-trash', 'btn-danger', `eliminarCarrera(${carrera.id})`)}
                </div>
            </td>
        </tr>
    `).join('');
}

// Abrir modal para nueva carrera
function abrirModalCarrera() {
    carreraEditando = null;
    const contenido = `
        <form onsubmit="guardarCarrera(event)">
            <div class="form-group">
                <label for="nombreCarrera">Nombre de la Carrera *</label>
                <input type="text" id="nombreCarrera" name="nombreCarrera" required
                       placeholder="Ej: Ingeniería de Sistemas">
            </div>

            <div class="form-group">
                <label for="facultadId">Facultad (opcional)</label>
                <select id="facultadId" name="facultadId">
                    <option value="">Seleccionar facultad...</option>
                    ${facultadesDisponibles.map(f =>
                        `<option value="${f.id}">${f.nombreFacultad}</option>`
                    ).join('')}
                </select>
                <small style="color: var(--text-secondary);">Puedes asignar la facultad más tarde</small>
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

    abrirModal('Nueva Carrera', contenido);

    setTimeout(() => {
        document.getElementById('nombreCarrera').focus();
    }, 100);
}

// Editar carrera
async function editarCarrera(id) {
    try {
        carreraEditando = await CarreraService.obtenerPorId(id);

        const contenido = `
            <form onsubmit="guardarCarrera(event)">
                <div class="form-group">
                    <label for="nombreCarrera">Nombre de la Carrera *</label>
                    <input type="text" id="nombreCarrera" name="nombreCarrera" required
                           value="${carreraEditando.nombreCarrera}"
                           placeholder="Ej: Ingeniería de Sistemas">
                </div>

                <div class="form-group">
                    <label for="facultadId">Facultad</label>
                    <select id="facultadId" name="facultadId">
                        <option value="">Seleccionar facultad...</option>
                        ${facultadesDisponibles.map(f =>
                            `<option value="${f.id}" ${carreraEditando.facultad?.id === f.id ? 'selected' : ''}>
                                ${f.nombreFacultad}
                            </option>`
                        ).join('')}
                    </select>
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

        abrirModal('Editar Carrera', contenido);

        setTimeout(() => {
            document.getElementById('nombreCarrera').focus();
            document.getElementById('nombreCarrera').select();
        }, 100);

    } catch (error) {
        console.error('Error al obtener carrera:', error);
        mostrarAlerta('Error al obtener los datos de la carrera', 'error');
    }
}

// Guardar carrera (crear o actualizar)
async function guardarCarrera(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const carreraData = {
        nombreCarrera: formData.get('nombreCarrera').trim(),
        facultad: formData.get('facultadId') ? { id: parseInt(formData.get('facultadId')) } : null
    };

    // Validaciones
    if (!carreraData.nombreCarrera) {
        mostrarAlerta('El nombre de la carrera es obligatorio', 'error');
        return;
    }

    try {
        if (carreraEditando) {
            // Actualizar
            await CarreraService.actualizar(carreraEditando.id, carreraData);
            mostrarAlerta('Carrera actualizada correctamente', 'success');
        } else {
            // Crear
            await CarreraService.crear(carreraData);
            mostrarAlerta('Carrera creada correctamente', 'success');
        }

        cerrarModal();
        await cargarCarreras();

    } catch (error) {
        console.error('Error al guardar carrera:', error);
        mostrarAlerta('Error al guardar la carrera', 'error');
    }
}

// Asignar facultad a carrera
async function asignarFacultadACarrera(carreraId) {
    const carrera = carreras.find(c => c.id === carreraId);
    if (!carrera) return;

    const contenido = `
        <form onsubmit="confirmarAsignacionFacultad(event, ${carreraId})">
            <p>Asignar facultad a la carrera: <strong>${carrera.nombreCarrera}</strong></p>

            <div class="form-group">
                <label for="facultadId">Seleccionar Facultad *</label>
                <select id="facultadId" name="facultadId" required>
                    <option value="">Seleccionar...</option>
                    ${facultadesDisponibles.map(f =>
                        `<option value="${f.id}">${f.nombreFacultad}</option>`
                    ).join('')}
                </select>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="cerrarModal()">
                    <i class="fas fa-times"></i> Cancelar
                </button>
                <button type="submit" class="btn btn-success">
                    <i class="fas fa-link"></i> Asignar
                </button>
            </div>
        </form>
    `;

    abrirModal('Asignar Facultad', contenido);

    setTimeout(() => {
        document.getElementById('facultadId').focus();
    }, 100);
}

// Confirmar asignación de facultad
async function confirmarAsignacionFacultad(event, carreraId) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const facultadId = parseInt(formData.get('facultadId'));

    if (!facultadId) {
        mostrarAlerta('Debes seleccionar una facultad', 'error');
        return;
    }

    console.log('🟡 FRONTEND - Enviando asignación:');
    console.log('🟡 CarreraId:', carreraId);
    console.log('🟡 FacultadId:', facultadId);

    try {
        const resultado = await CarreraService.asignarFacultad(carreraId, facultadId);
        console.log('🟡 FRONTEND - Respuesta del backend:', resultado);

        mostrarAlerta('Facultad asignada correctamente', 'success');
        cerrarModal();
        await cargarCarreras();
    } catch (error) {
        console.error('🔴 FRONTEND - Error al asignar facultad:', error);
        mostrarAlerta('Error al asignar la facultad', 'error');
    }
}

// Eliminar carrera
async function eliminarCarrera(id) {
    const carrera = carreras.find(c => c.id === id);
    if (!carrera) return;

    confirmarEliminacion(`la carrera "${carrera.nombreCarrera}"`, async () => {
        try {
            await CarreraService.eliminar(id);
            mostrarAlerta('Carrera eliminada correctamente', 'success');
            await cargarCarreras();
        } catch (error) {
            console.error('Error al eliminar carrera:', error);
            mostrarAlerta('Error al eliminar la carrera', 'error');
        }
    });
}