// Variables para asignaturas
let asignaturas = [];
let asignaturaEditando = null;

// Cargar asignaturas
async function cargarAsignaturas() {
    try {
        asignaturas = await AsignaturaService.listarTodas();
        renderizarAsignaturas();
    } catch (error) {
        console.error('Error al cargar asignaturas:', error);
        mostrarAlerta('Error al cargar las asignaturas', 'error');
    }
}

// Filtrar asignaturas por carrera
async function filtrarAsignaturasPorCarrera() {
    const carreraId = document.getElementById('filtro-carrera-asignaturas').value;

    try {
        if (carreraId) {
            asignaturas = await AsignaturaService.obtenerPorCarrera(carreraId);
        } else {
            asignaturas = await AsignaturaService.listarTodas();
        }
        renderizarAsignaturas();
    } catch (error) {
        console.error('Error al filtrar asignaturas:', error);
        mostrarAlerta('Error al filtrar las asignaturas', 'error');
    }
}

// Renderizar tabla de asignaturas
function renderizarAsignaturas() {
    const tbody = document.getElementById('asignaturas-tbody');

    if (!asignaturas || asignaturas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                    No hay asignaturas registradas
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = asignaturas.map(asignatura => `
        <tr>
            <td>${asignatura.id}</td>
            <td>
                <strong>${asignatura.nombreAsignatura}</strong>
            </td>
            <td>
                ${asignatura.carrera ?
                    `<span class="badge">${asignatura.carrera.nombreCarrera}</span>` :
                    '<span style="color: var(--warning-color);">Sin asignar</span>'
                }
            </td>
            <td>
                <div class="action-buttons">
                    ${!asignatura.carrera ?
                        crearBotonAccion('Asignar', 'fa-link', 'btn-success', `asignarCarreraAAsignatura(${asignatura.id})`) : ''
                    }
                    ${crearBotonAccion('Editar', 'fa-edit', 'btn-secondary', `editarAsignatura(${asignatura.id})`)}
                    ${crearBotonAccion('Eliminar', 'fa-trash', 'btn-danger', `eliminarAsignatura(${asignatura.id})`)}
                </div>
            </td>
        </tr>
    `).join('');
}

// Abrir modal para nueva asignatura
function abrirModalAsignatura() {
    asignaturaEditando = null;
    const contenido = `
        <form onsubmit="guardarAsignatura(event)">
            <div class="form-group">
                <label for="nombreAsignatura">Nombre de la Asignatura *</label>
                <input type="text" id="nombreAsignatura" name="nombreAsignatura" required
                       placeholder="Ej: Programación Orientada a Objetos">
            </div>

            <div class="form-group">
                <label for="carreraId">Carrera (opcional)</label>
                <select id="carreraId" name="carreraId">
                    <option value="">Seleccionar carrera...</option>
                    ${carrerasDisponibles.map(c =>
                        `<option value="${c.id}">${c.nombreCarrera}</option>`
                    ).join('')}
                </select>
                <small style="color: var(--text-secondary);">Puedes asignar la carrera más tarde</small>
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

    abrirModal('Nueva Asignatura', contenido);

    setTimeout(() => {
        document.getElementById('nombreAsignatura').focus();
    }, 100);
}

// Editar asignatura
async function editarAsignatura(id) {
    try {
        asignaturaEditando = await AsignaturaService.obtenerPorId(id);

        const contenido = `
            <form onsubmit="guardarAsignatura(event)">
                <div class="form-group">
                    <label for="nombreAsignatura">Nombre de la Asignatura *</label>
                    <input type="text" id="nombreAsignatura" name="nombreAsignatura" required
                           value="${asignaturaEditando.nombreAsignatura}"
                           placeholder="Ej: Programación Orientada a Objetos">
                </div>

                <div class="form-group">
                    <label for="carreraId">Carrera</label>
                    <select id="carreraId" name="carreraId">
                        <option value="">Seleccionar carrera...</option>
                        ${carrerasDisponibles.map(c =>
                            `<option value="${c.id}" ${asignaturaEditando.carrera?.id === c.id ? 'selected' : ''}>
                                ${c.nombreCarrera}
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

        abrirModal('Editar Asignatura', contenido);

        setTimeout(() => {
            document.getElementById('nombreAsignatura').focus();
            document.getElementById('nombreAsignatura').select();
        }, 100);

    } catch (error) {
        console.error('Error al obtener asignatura:', error);
        mostrarAlerta('Error al obtener los datos de la asignatura', 'error');
    }
}

// Guardar asignatura (crear o actualizar)
async function guardarAsignatura(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const asignaturaData = {
        nombreAsignatura: formData.get('nombreAsignatura').trim(),
        carrera: formData.get('carreraId') ? { id: parseInt(formData.get('carreraId')) } : null
    };

    // Validaciones
    if (!asignaturaData.nombreAsignatura) {
        mostrarAlerta('El nombre de la asignatura es obligatorio', 'error');
        return;
    }

    try {
        if (asignaturaEditando) {
            // Actualizar
            await AsignaturaService.actualizar(asignaturaEditando.id, asignaturaData);
            mostrarAlerta('Asignatura actualizada correctamente', 'success');
        } else {
            // Crear
            await AsignaturaService.crear(asignaturaData);
            mostrarAlerta('Asignatura creada correctamente', 'success');
        }

        cerrarModal();
        await cargarAsignaturas();

    } catch (error) {
        console.error('Error al guardar asignatura:', error);
        mostrarAlerta('Error al guardar la asignatura', 'error');
    }
}

// Asignar carrera a asignatura
async function asignarCarreraAAsignatura(asignaturaId) {
    const asignatura = asignaturas.find(a => a.id === asignaturaId);
    if (!asignatura) return;

    const contenido = `
        <form onsubmit="confirmarAsignacionCarreraAsignatura(event, ${asignaturaId})">
            <p>Asignar carrera a la asignatura: <strong>${asignatura.nombreAsignatura}</strong></p>

            <div class="form-group">
                <label for="carreraId">Seleccionar Carrera *</label>
                <select id="carreraId" name="carreraId" required>
                    <option value="">Seleccionar...</option>
                    ${carrerasDisponibles.map(c =>
                        `<option value="${c.id}">${c.nombreCarrera}</option>`
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

    abrirModal('Asignar Carrera', contenido);

    setTimeout(() => {
        document.getElementById('carreraId').focus();
    }, 100);
}

// Confirmar asignación de carrera a asignatura
async function confirmarAsignacionCarreraAsignatura(event, asignaturaId) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const carreraId = parseInt(formData.get('carreraId'));

    if (!carreraId) {
        mostrarAlerta('Debes seleccionar una carrera', 'error');
        return;
    }

    try {
        await AsignaturaService.asignarCarrera(asignaturaId, carreraId);
        mostrarAlerta('Carrera asignada correctamente', 'success');
        cerrarModal();
        await cargarAsignaturas();
    } catch (error) {
        console.error('Error al asignar carrera:', error);
        mostrarAlerta('Error al asignar la carrera', 'error');
    }
}

// Eliminar asignatura
async function eliminarAsignatura(id) {
    const asignatura = asignaturas.find(a => a.id === id);
    if (!asignatura) return;

    confirmarEliminacion(`la asignatura "${asignatura.nombreAsignatura}"`, async () => {
        try {
            await AsignaturaService.eliminar(id);
            mostrarAlerta('Asignatura eliminada correctamente', 'success');
            await cargarAsignaturas();
        } catch (error) {
            console.error('Error al eliminar asignatura:', error);
            mostrarAlerta('Error al eliminar la asignatura', 'error');
        }
    });
}