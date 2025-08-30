// Variables para notas
let notas = [];
let notaEditando = null;
let alumnosDisponibles = [];
let asignaturasDisponibles = [];
let profesoresDisponibles = [];

// Tipos de nota disponibles
const TIPOS_NOTA = {
    PARCIAL: 'Parcial',
    FINAL: 'Final',
    PRACTICA: 'Práctica',
    TAREA: 'Tarea',
    EXAMEN: 'Examen'
};

// Cargar notas
async function cargarNotas() {
    try {
        notas = await NotaService.listarTodas();
        renderizarNotas();
        await calcularEstadisticas();
    } catch (error) {
        console.error('Error al cargar notas:', error);
        mostrarAlerta('Error al cargar las notas', 'error');
    }
}

// Cargar filtro de alumnos
async function cargarFiltroAlumnos(contexto = 'notas') {
    try {
        alumnosDisponibles = await AlumnoService.listarTodos();
        const select = document.getElementById(`filtro-alumno-${contexto}`);

        if (select) {
            select.innerHTML = '<option value="">Todos los Alumnos</option>' +
                alumnosDisponibles.map(a =>
                    `<option value="${a.id}">${a.nombreCompleto}</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Error al cargar alumnos:', error);
    }
}

// Cargar filtro de asignaturas
async function cargarFiltroAsignaturas(contexto = 'notas') {
    try {
        asignaturasDisponibles = await AsignaturaService.listarTodas();
        const select = document.getElementById(`filtro-asignatura-${contexto}`);

        if (select) {
            select.innerHTML = '<option value="">Todas las Asignaturas</option>' +
                asignaturasDisponibles.map(a =>
                    `<option value="${a.id}">${a.nombreAsignatura}</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Error al cargar asignaturas:', error);
    }
}

// Cargar profesores disponibles
async function cargarProfesoresDisponibles() {
    try {
        profesoresDisponibles = await ProfesorService.listarTodos();
    } catch (error) {
        console.error('Error al cargar profesores:', error);
    }
}

// Filtrar notas por alumno
async function filtrarNotasPorAlumno() {
    const alumnoId = document.getElementById('filtro-alumno-notas').value;

    try {
        if (alumnoId) {
            notas = await NotaService.obtenerPorAlumno(alumnoId);
        } else {
            notas = await NotaService.listarTodas();
        }
        renderizarNotas();
        await calcularEstadisticas();
    } catch (error) {
        console.error('Error al filtrar notas por alumno:', error);
        mostrarAlerta('Error al filtrar las notas', 'error');
    }
}

// Filtrar notas por asignatura
async function filtrarNotasPorAsignatura() {
    const asignaturaId = document.getElementById('filtro-asignatura-notas').value;

    try {
        if (asignaturaId) {
            notas = await NotaService.obtenerPorAsignatura(asignaturaId);
        } else {
            notas = await NotaService.listarTodas();
        }
        renderizarNotas();
        await calcularEstadisticas();
    } catch (error) {
        console.error('Error al filtrar notas por asignatura:', error);
        mostrarAlerta('Error al filtrar las notas', 'error');
    }
}

// Calcular estadísticas
async function calcularEstadisticas() {
    try {
        let promedioGeneral = 0;

        if (notas && notas.length > 0) {
            const suma = notas.reduce((acc, nota) => acc + nota.valor, 0);
            promedioGeneral = suma / notas.length;
        }

        document.getElementById('promedio-general').textContent = formatearNumero(promedioGeneral);
    } catch (error) {
        console.error('Error al calcular estadísticas:', error);
        document.getElementById('promedio-general').textContent = '--';
    }
}

// Renderizar tabla de notas
function renderizarNotas() {
    const tbody = document.getElementById('notas-tbody');

    if (!notas || notas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                    No hay notas registradas
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = notas.map(nota => `
        <tr>
            <td>${nota.id}</td>
            <td>
                ${nota.alumno ?
                    `<strong>${nota.alumno.nombreCompleto}</strong>` :
                    '<span style="color: var(--warning-color);">Sin asignar</span>'
                }
            </td>
            <td>
                ${nota.asignatura ?
                    `<span class="badge">${nota.asignatura.nombreAsignatura}</span>` :
                    '<span style="color: var(--warning-color);">Sin asignar</span>'
                }
            </td>
            <td>
                ${nota.profesor ?
                    nota.profesor.nombreCompleto :
                    '<span style="color: var(--warning-color);">Sin asignar</span>'
                }
            </td>
            <td>
                <strong style="color: ${obtenerColorNota(nota.valor)};">
                    ${formatearNumero(nota.valor)}
                </strong>
            </td>
            <td>
                <span class="badge ${obtenerClaseTipo(nota.tipo)}">
                    ${TIPOS_NOTA[nota.tipo] || nota.tipo}
                </span>
            </td>
            <td>${formatearFecha(nota.fecha)}</td>
            <td>
                <div class="action-buttons">
                    ${generarBotonesAsignacion(nota)}
                    ${crearBotonAccion('Editar', 'fa-edit', 'btn-secondary', `editarNota(${nota.id})`)}
                    ${crearBotonAccion('Eliminar', 'fa-trash', 'btn-danger', `eliminarNota(${nota.id})`)}
                </div>
            </td>
        </tr>
    `).join('');
}

// Generar botones de asignación según lo que falta
function generarBotonesAsignacion(nota) {
    let botones = '';

    if (!nota.alumno) {
        botones += crearBotonAccion('Alumno', 'fa-user-plus', 'btn-success btn-sm', `asignarAlumnoANota(${nota.id})`);
    }

    if (!nota.asignatura) {
        botones += crearBotonAccion('Asignatura', 'fa-book-plus', 'btn-success btn-sm', `asignarAsignaturaANota(${nota.id})`);
    }

    if (!nota.profesor) {
        botones += crearBotonAccion('Profesor', 'fa-user-tie', 'btn-success btn-sm', `asignarProfesorANota(${nota.id})`);
    }

    return botones;
}

// Obtener color para la nota
function obtenerColorNota(valor) {
    if (valor >= 18) return 'var(--success-color)';
    if (valor >= 14) return 'var(--warning-color)';
    return 'var(--danger-color)';
}

// Obtener clase CSS para el tipo de nota
function obtenerClaseTipo(tipo) {
    switch (tipo) {
        case 'FINAL': return 'badge-final';
        case 'PARCIAL': return 'badge-parcial';
        case 'PRACTICA': return 'badge-practica';
        case 'TAREA': return 'badge-tarea';
        case 'EXAMEN': return 'badge-examen';
        default: return '';
    }
}

// Abrir modal para nueva nota
async function abrirModalNota() {
    notaEditando = null;
    await cargarProfesoresDisponibles();

    const contenido = `
        <form onsubmit="guardarNota(event)">
            <div class="form-group">
                <label for="valor">Valor de la Nota *</label>
                <input type="number" id="valor" name="valor" required
                       min="0" max="20" step="0.1"
                       placeholder="Ej: 18.5">
            </div>

            <div class="form-group">
                <label for="tipo">Tipo de Nota *</label>
                <select id="tipo" name="tipo" required>
                    <option value="">Seleccionar tipo...</option>
                    ${Object.entries(TIPOS_NOTA).map(([key, value]) =>
                        `<option value="${key}">${value}</option>`
                    ).join('')}
                </select>
            </div>

            <div class="form-group">
                <label for="fecha">Fecha *</label>
                <input type="date" id="fecha" name="fecha" required
                       value="${new Date().toISOString().split('T')[0]}">
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

            <div class="form-group">
                <label for="profesorId">Profesor (opcional)</label>
                <select id="profesorId" name="profesorId">
                    <option value="">Seleccionar profesor...</option>
                    ${profesoresDisponibles.map(p =>
                        `<option value="${p.id}">${p.nombreCompleto}</option>`
                    ).join('')}
                </select>
                <small style="color: var(--text-secondary);">Puedes asignar el profesor más tarde</small>
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

    abrirModal('Nueva Nota', contenido);

    setTimeout(() => {
        document.getElementById('valor').focus();
    }, 100);
}

// Editar nota
async function editarNota(id) {
    try {
        notaEditando = await NotaService.obtenerPorId ? await NotaService.obtenerPorId(id) :
            notas.find(n => n.id === id);

        await cargarProfesoresDisponibles();

        const contenido = `
            <form onsubmit="guardarNota(event)">
                <div class="form-group">
                    <label for="valor">Valor de la Nota *</label>
                    <input type="number" id="valor" name="valor" required
                           min="0" max="20" step="0.1"
                           value="${notaEditando.valor}"
                           placeholder="Ej: 18.5">
                </div>

                <div class="form-group">
                    <label for="tipo">Tipo de Nota *</label>
                    <select id="tipo" name="tipo" required>
                        <option value="">Seleccionar tipo...</option>
                        ${Object.entries(TIPOS_NOTA).map(([key, value]) =>
                            `<option value="${key}" ${notaEditando.tipo === key ? 'selected' : ''}>${value}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label for="fecha">Fecha *</label>
                    <input type="date" id="fecha" name="fecha" required
                           value="${notaEditando.fecha}">
                </div>

                <div class="form-group">
                    <label for="alumnoId">Alumno</label>
                    <select id="alumnoId" name="alumnoId">
                        <option value="">Seleccionar alumno...</option>
                        ${alumnosDisponibles.map(a =>
                            `<option value="${a.id}" ${notaEditando.alumno?.id === a.id ? 'selected' : ''}>
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
                            `<option value="${a.id}" ${notaEditando.asignatura?.id === a.id ? 'selected' : ''}>
                                ${a.nombreAsignatura}
                            </option>`
                        ).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label for="profesorId">Profesor</label>
                    <select id="profesorId" name="profesorId">
                        <option value="">Seleccionar profesor...</option>
                        ${profesoresDisponibles.map(p =>
                            `<option value="${p.id}" ${notaEditando.profesor?.id === p.id ? 'selected' : ''}>
                                ${p.nombreCompleto}
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

        abrirModal('Editar Nota', contenido);

        setTimeout(() => {
            document.getElementById('valor').focus();
            document.getElementById('valor').select();
        }, 100);

    } catch (error) {
        console.error('Error al obtener nota:', error);
        mostrarAlerta('Error al obtener los datos de la nota', 'error');
    }
}

// Guardar nota (crear o actualizar)
async function guardarNota(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const notaData = {
        valor: parseFloat(formData.get('valor')),
        tipo: formData.get('tipo'),
        fecha: formData.get('fecha'),
        alumno: formData.get('alumnoId') ? { id: parseInt(formData.get('alumnoId')) } : null,
        asignatura: formData.get('asignaturaId') ? { id: parseInt(formData.get('asignaturaId')) } : null,
        profesor: formData.get('profesorId') ? { id: parseInt(formData.get('profesorId')) } : null
    };

    // Validaciones
    if (isNaN(notaData.valor) || notaData.valor < 0 || notaData.valor > 20) {
        mostrarAlerta('El valor de la nota debe estar entre 0 y 20', 'error');
        return;
    }

    if (!notaData.tipo) {
        mostrarAlerta('Debes seleccionar un tipo de nota', 'error');
        return;
    }

    if (!notaData.fecha) {
        mostrarAlerta('La fecha es obligatoria', 'error');
        return;
    }

    try {
        if (notaEditando) {
            // Actualizar
            await NotaService.actualizar(notaEditando.id, notaData);
            mostrarAlerta('Nota actualizada correctamente', 'success');
        } else {
            // Crear
            await NotaService.crear(notaData);
            mostrarAlerta('Nota creada correctamente', 'success');
        }

        cerrarModal();
        await cargarNotas();

    } catch (error) {
        console.error('Error al guardar nota:', error);
        mostrarAlerta('Error al guardar la nota', 'error');
    }
}

// Asignar alumno a nota
async function asignarAlumnoANota(notaId) {
    const nota = notas.find(n => n.id === notaId);
    if (!nota) return;

    const contenido = `
        <form onsubmit="confirmarAsignacionAlumnoNota(event, ${notaId})">
            <p>Asignar alumno a la nota:</p>
            <p><strong>Valor:</strong> ${formatearNumero(nota.valor)} | <strong>Tipo:</strong> ${TIPOS_NOTA[nota.tipo] || nota.tipo}</p>

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

// Confirmar asignación de alumno a nota
async function confirmarAsignacionAlumnoNota(event, notaId) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const alumnoId = parseInt(formData.get('alumnoId'));

    if (!alumnoId) {
        mostrarAlerta('Debes seleccionar un alumno', 'error');
        return;
    }

    try {
        await NotaService.asignarAlumno(notaId, alumnoId);
        mostrarAlerta('Alumno asignado correctamente', 'success');
        cerrarModal();
        await cargarNotas();
    } catch (error) {
        console.error('Error al asignar alumno:', error);
        mostrarAlerta('Error al asignar el alumno', 'error');
    }
}

// Asignar asignatura a nota
async function asignarAsignaturaANota(notaId) {
    const nota = notas.find(n => n.id === notaId);
    if (!nota) return;

    const contenido = `
        <form onsubmit="confirmarAsignacionAsignaturaNota(event, ${notaId})">
            <p>Asignar asignatura a la nota:</p>
            <p><strong>Valor:</strong> ${formatearNumero(nota.valor)} | <strong>Tipo:</strong> ${TIPOS_NOTA[nota.tipo] || nota.tipo}</p>

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

// Confirmar asignación de asignatura a nota
async function confirmarAsignacionAsignaturaNota(event, notaId) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const asignaturaId = parseInt(formData.get('asignaturaId'));

    if (!asignaturaId) {
        mostrarAlerta('Debes seleccionar una asignatura', 'error');
        return;
    }

    try {
        await NotaService.asignarAsignatura(notaId, asignaturaId);
        mostrarAlerta('Asignatura asignada correctamente', 'success');
        cerrarModal();
        await cargarNotas();
    } catch (error) {
        console.error('Error al asignar asignatura:', error);
        mostrarAlerta('Error al asignar la asignatura', 'error');
    }
}

// Asignar profesor a nota
async function asignarProfesorANota(notaId) {
    const nota = notas.find(n => n.id === notaId);
    if (!nota) return;

    const contenido = `
        <form onsubmit="confirmarAsignacionProfesorNota(event, ${notaId})">
            <p>Asignar profesor a la nota:</p>
            <p><strong>Valor:</strong> ${formatearNumero(nota.valor)} | <strong>Tipo:</strong> ${TIPOS_NOTA[nota.tipo] || nota.tipo}</p>

            <div class="form-group">
                <label for="profesorId">Seleccionar Profesor *</label>
                <select id="profesorId" name="profesorId" required>
                    <option value="">Seleccionar...</option>
                    ${profesoresDisponibles.map(p =>
                        `<option value="${p.id}">${p.nombreCompleto}</option>`
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

    abrirModal('Asignar Profesor', contenido);

    setTimeout(() => {
        document.getElementById('profesorId').focus();
    }, 100);
}

// Confirmar asignación de profesor a nota
async function confirmarAsignacionProfesorNota(event, notaId) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const profesorId = parseInt(formData.get('profesorId'));

    if (!profesorId) {
        mostrarAlerta('Debes seleccionar un profesor', 'error');
        return;
    }

    try {
        await NotaService.asignarProfesor(notaId, profesorId);
        mostrarAlerta('Profesor asignado correctamente', 'success');
        cerrarModal();
        await cargarNotas();
    } catch (error) {
        console.error('Error al asignar profesor:', error);
        mostrarAlerta('Error al asignar el profesor', 'error');
    }
}

// Eliminar nota
async function eliminarNota(id) {
    const nota = notas.find(n => n.id === id);
    if (!nota) return;

    const descripcion = `la nota de ${formatearNumero(nota.valor)} (${TIPOS_NOTA[nota.tipo] || nota.tipo})`;

    confirmarEliminacion(descripcion, async () => {
        try {
            await NotaService.eliminar(id);
            mostrarAlerta('Nota eliminada correctamente', 'success');
            await cargarNotas();
        } catch (error) {
            console.error('Error al eliminar nota:', error);
            mostrarAlerta('Error al eliminar la nota', 'error');
        }
    });
}