// Variables para asistencias
let asistencias = [];
let asistenciaEditando = null;

// Cargar asistencias
async function cargarAsistencias() {
    try {
        asistencias = await AsistenciaService.listarTodas();
        renderizarAsistencias();
    } catch (error) {
        console.error('Error al cargar asistencias:', error);
        mostrarAlerta('Error al cargar las asistencias', 'error');
    }
}

// Filtrar asistencias por alumno
async function filtrarAsistenciasPorAlumno() {
    const alumnoId = document.getElementById('filtro-alumno-asistencias').value;

    try {
        if (alumnoId) {
            asistencias = await AsistenciaService.obtenerPorAlumno(alumnoId);
        } else {
            asistencias = await AsistenciaService.listarTodas();
        }
        renderizarAsistencias();
    } catch (error) {
        console.error('Error al filtrar asistencias por alumno:', error);
        mostrarAlerta('Error al filtrar las asistencias', 'error');
    }
}

// Filtrar asistencias por asignatura
async function filtrarAsistenciasPorAsignatura() {
    const asignaturaId = document.getElementById('filtro-asignatura-asistencias').value;

    try {
        if (asignaturaId) {
            asistencias = await AsistenciaService.obtenerPorAsignatura(asignaturaId);
        } else {
            asistencias = await AsistenciaService.listarTodas();
        }
        renderizarAsistencias();
    } catch (error) {
        console.error('Error al filtrar asistencias por asignatura:', error);
        mostrarAlerta('Error al filtrar las asistencias', 'error');
    }
}

// Renderizar tabla de asistencias
function renderizarAsistencias() {
    const tbody = document.getElementById('asistencias-tbody');

    if (!asistencias || asistencias.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                    No hay asistencias registradas
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = asistencias.map(asistencia => `
        <tr>
            <td>${asistencia.id}</td>
            <td>
                ${asistencia.alumno ?
                    `<strong>${asistencia.alumno.nombreCompleto}</strong>` :
                    '<span style="color: var(--warning-color);">Sin asignar</span>'
                }
            </td>
            <td>
                ${asistencia.asignatura ?
                    `<span class="badge">${asistencia.asignatura.nombreAsignatura}</span>` :
                    '<span style="color: var(--warning-color);">Sin asignar</span>'
                }
            </td>
            <td>${formatearFecha(asistencia.fechaAsistencia)}</td>
            <td>
                ${generarBadgeEstado(asistencia.presente)}
            </td>
            <td>
                <div class="action-buttons">
                    ${generarBotonesAsignacionAsistencia(asistencia)}
                    ${generarBotonesEstado(asistencia)}
                    ${crearBotonAccion('Editar', 'fa-edit', 'btn-secondary', `editarAsistencia(${asistencia.id})`)}
                    ${crearBotonAccion('Eliminar', 'fa-trash', 'btn-danger', `eliminarAsistencia(${asistencia.id})`)}
                </div>
            </td>
        </tr>
    `).join('');
}

// Generar badge de estado
function generarBadgeEstado(presente) {
    if (presente === null || presente === undefined) {
        return '<span class="badge pendiente"><i class="fas fa-clock"></i> Pendiente</span>';
    }

    if (presente) {
        return '<span class="badge presente"><i class="fas fa-check"></i> Presente</span>';
    } else {
        return '<span class="badge ausente"><i class="fas fa-times"></i> Ausente</span>';
    }
}

// Generar botones de asignación según lo que falta
function generarBotonesAsignacionAsistencia(asistencia) {
    let botones = '';

    if (!asistencia.alumno) {
        botones += crearBotonAccion('Alumno', 'fa-user-plus', 'btn-success btn-sm', `asignarAlumnoAAsistencia(${asistencia.id})`);
    }

    if (!asistencia.asignatura) {
        botones += crearBotonAccion('Asignatura', 'fa-book-plus', 'btn-success btn-sm', `asignarAsignaturaAAsistencia(${asistencia.id})`);
    }

    return botones;
}

// Generar botones de estado
function generarBotonesEstado(asistencia) {
    if (asistencia.presente === null || asistencia.presente === undefined) {
        return `
            ${crearBotonAccion('Presente', 'fa-check', 'btn-success btn-sm', `marcarPresente(${asistencia.id})`)}
            ${crearBotonAccion('Ausente', 'fa-times', 'btn-danger btn-sm', `marcarAusente(${asistencia.id})`)}
        `;
    }
    return '';
}

// Marcar presente
async function marcarPresente(id) {
    try {
        const asistencia = asistencias.find(a => a.id === id);
        asistencia.presente = true;

        await AsistenciaService.actualizar(id, asistencia);
        mostrarAlerta('Marcado como presente', 'success');
        await cargarAsistencias();
    } catch (error) {
        console.error('Error al marcar presente:', error);
        mostrarAlerta('Error al marcar la asistencia', 'error');
    }
}

// Marcar ausente
async function marcarAusente(id) {
    try {
        const asistencia = asistencias.find(a => a.id === id);
        asistencia.presente = false;

        await AsistenciaService.actualizar(id, asistencia);
        mostrarAlerta('Marcado como ausente', 'warning');
        await cargarAsistencias();
    } catch (error) {
        console.error('Error al marcar ausente:', error);
        mostrarAlerta('Error al marcar la asistencia', 'error');
    }
}

// Abrir modal para nueva asistencia
function abrirModalAsistencia() {
    asistenciaEditando = null;

    const contenido = `
        <form onsubmit="guardarAsistencia(event)">
            <div class="form-group">
                <label for="fechaAsistencia">Fecha de Asistencia *</label>
                <input type="date" id="fechaAsistencia" name="fechaAsistencia" required
                       value="${new Date().toISOString().split('T')[0]}">
            </div>

            <div class="form-group">
                <label for="presente">Estado</label>
                <select id="presente" name="presente">
                    <option value="">Pendiente</option>
                    <option value="true">Presente</option>
                    <option value="false">Ausente</option>
                </select>
                <small style="color: var(--text-secondary);">Puedes definir el estado más tarde</small>
            </div>

            <div class="form-group">
                <label for="alumnoId">Alumno (opcional)</label>
                <select id="alumnoId" name="alumnoId">
                    <option value="">Seleccionar alumno...</option>
                    ${alumnosDisponibles.map(a =>
                        `<option value="${a.id}">${a.nombreCompleto}</option>`
                    ).join('')}
                </select>
                <small style="color: var(--text-secondary);">Puedes asignar el alumno más tarde</small>
            </div>

            <div class="form-group">
                <label for="asignaturaId">Asignatura (opcional)</label>
                <select id="asignaturaId" name="asignaturaId">
                    <option value="">Seleccionar asignatura...</option>
                    ${asignaturasDisponibles.map(a =>
                        `<option value="${a.id}">${a.nombreAsignatura}</option>`
                    ).join('')}
                </select>
                <small style="color: var(--text-secondary);">Puedes asignar la asignatura más tarde</small>
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

    abrirModal('Nueva Asistencia', contenido);

    setTimeout(() => {
        document.getElementById('fechaAsistencia').focus();
    }, 100);
}

// Editar asistencia
async function editarAsistencia(id) {
    try {
        asistenciaEditando = asistencias.find(a => a.id === id);

        const contenido = `
            <form onsubmit="guardarAsistencia(event)">
                <div class="form-group">
                    <label for="fechaAsistencia">Fecha de Asistencia *</label>
                    <input type="date" id="fechaAsistencia" name="fechaAsistencia" required
                           value="${asistenciaEditando.fechaAsistencia}">
                </div>

                <div class="form-group">
                    <label for="presente">Estado</label>
                    <select id="presente" name="presente">
                        <option value="" ${asistenciaEditando.presente === null ? 'selected' : ''}>Pendiente</option>
                        <option value="true" ${asistenciaEditando.presente === true ? 'selected' : ''}>Presente</option>
                        <option value="false" ${asistenciaEditando.presente === false ? 'selected' : ''}>Ausente</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="alumnoId">Alumno</label>
                    <select id="alumnoId" name="alumnoId">
                        <option value="">Seleccionar alumno...</option>
                        ${alumnosDisponibles.map(a =>
                            `<option value="${a.id}" ${asistenciaEditando.alumno?.id === a.id ? 'selected' : ''}>
                                ${a.nombreCompleto}
                            </option>`
                        ).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label for="asignaturaId">Asignatura</label>
                    <select id="asignaturaId" name="asignaturaId">
                        <option value="">Seleccionar asignatura...</option>
                        ${asignaturasDisponibles.map(a =>
                            `<option value="${a.id}" ${asistenciaEditando.asignatura?.id === a.id ? 'selected' : ''}>
                                ${a.nombreAsignatura}
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

        abrirModal('Editar Asistencia', contenido);

        setTimeout(() => {
            document.getElementById('fechaAsistencia').focus();
        }, 100);

    } catch (error) {
        console.error('Error al obtener asistencia:', error);
        mostrarAlerta('Error al obtener los datos de la asistencia', 'error');
    }
}

// Guardar asistencia (crear o actualizar)
async function guardarAsistencia(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const presenteValue = formData.get('presente');

    const asistenciaData = {
        fechaAsistencia: formData.get('fechaAsistencia'),
        presente: presenteValue === '' ? null : presenteValue === 'true',
        alumno: formData.get('alumnoId') ? { id: parseInt(formData.get('alumnoId')) } : null,
        asignatura: formData.get('asignaturaId') ? { id: parseInt(formData.get('asignaturaId')) } : null
    };

    // Validaciones
    if (!asistenciaData.fechaAsistencia) {
        mostrarAlerta('La fecha de asistencia es obligatoria', 'error');
        return;
    }

    try {
        if (asistenciaEditando) {
            // Actualizar
            await AsistenciaService.actualizar(asistenciaEditando.id, asistenciaData);
            mostrarAlerta('Asistencia actualizada correctamente', 'success');
        } else {
            // Crear
            await AsistenciaService.crear(asistenciaData);
            mostrarAlerta('Asistencia creada correctamente', 'success');
        }

        cerrarModal();
        await cargarAsistencias();

    } catch (error) {
        console.error('Error al guardar asistencia:', error);
        mostrarAlerta('Error al guardar la asistencia', 'error');
    }
}

// Asignar alumno a asistencia
async function asignarAlumnoAAsistencia(asistenciaId) {
    const asistencia = asistencias.find(a => a.id === asistenciaId);
    if (!asistencia) return;

    const contenido = `
        <form onsubmit="confirmarAsignacionAlumnoAsistencia(event, ${asistenciaId})">
            <p>Asignar alumno a la asistencia del: <strong>${formatearFecha(asistencia.fechaAsistencia)}</strong></p>

            <div class="form-group">
                <label for="alumnoId">Seleccionar Alumno *</label>
                <select id="alumnoId" name="alumnoId" required>
                    <option value="">Seleccionar...</option>
                    ${alumnosDisponibles.map(a =>
                        `<option value="${a.id}">${a.nombreCompleto}</option>`
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

    abrirModal('Asignar Alumno', contenido);

    setTimeout(() => {
        document.getElementById('alumnoId').focus();
    }, 100);
}

// Confirmar asignación de alumno a asistencia
async function confirmarAsignacionAlumnoAsistencia(event, asistenciaId) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const alumnoId = parseInt(formData.get('alumnoId'));

    if (!alumnoId) {
        mostrarAlerta('Debes seleccionar un alumno', 'error');
        return;
    }

    try {
        await AsistenciaService.asignarAlumno(asistenciaId, alumnoId);
        mostrarAlerta('Alumno asignado correctamente', 'success');
        cerrarModal();
        await cargarAsistencias();
    } catch (error) {
        console.error('Error al asignar alumno:', error);
        mostrarAlerta('Error al asignar el alumno', 'error');
    }
}

// Asignar asignatura a asistencia
async function asignarAsignaturaAAsistencia(asistenciaId) {
    const asistencia = asistencias.find(a => a.id === asistenciaId);
    if (!asistencia) return;

    const contenido = `
        <form onsubmit="confirmarAsignacionAsignaturaAsistencia(event, ${asistenciaId})">
            <p>Asignar asignatura a la asistencia del: <strong>${formatearFecha(asistencia.fechaAsistencia)}</strong></p>

            <div class="form-group">
                <label for="asignaturaId">Seleccionar Asignatura *</label>
                <select id="asignaturaId" name="asignaturaId" required>
                    <option value="">Seleccionar...</option>
                    ${asignaturasDisponibles.map(a =>
                        `<option value="${a.id}">${a.nombreAsignatura}</option>`
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

    abrirModal('Asignar Asignatura', contenido);

    setTimeout(() => {
        document.getElementById('asignaturaId').focus();
    }, 100);
}

// Confirmar asignación de asignatura a asistencia
async function confirmarAsignacionAsignaturaAsistencia(event, asistenciaId) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const asignaturaId = parseInt(formData.get('asignaturaId'));

    if (!asignaturaId) {
        mostrarAlerta('Debes seleccionar una asignatura', 'error');
        return;
    }

    try {
        await AsistenciaService.asignarAsignatura(asistenciaId, asignaturaId);
        mostrarAlerta('Asignatura asignada correctamente', 'success');
        cerrarModal();
        await cargarAsistencias();
    } catch (error) {
        console.error('Error al asignar asignatura:', error);
        mostrarAlerta('Error al asignar la asignatura', 'error');
    }
}

// Eliminar asistencia
async function eliminarAsistencia(id) {
    const asistencia = asistencias.find(a => a.id === id);
    if (!asistencia) return;

    const descripcion = `la asistencia del ${formatearFecha(asistencia.fechaAsistencia)}`;

    confirmarEliminacion(descripcion, async () => {
        try {
            await AsistenciaService.eliminar(id);
            mostrarAlerta('Asistencia eliminada correctamente', 'success');
            await cargarAsistencias();
        } catch (error) {
            console.error('Error al eliminar asistencia:', error);
            mostrarAlerta('Error al eliminar la asistencia', 'error');
        }
    });
}