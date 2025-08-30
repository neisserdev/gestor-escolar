// Variables para alumnos
let alumnos = [];
let alumnoEditando = null;
let carrerasDisponibles = [];

// Cargar alumnos
async function cargarAlumnos() {
    try {
        alumnos = await AlumnoService.listarTodos();
        renderizarAlumnos();
    } catch (error) {
        console.error('Error al cargar alumnos:', error);
        mostrarAlerta('Error al cargar los alumnos', 'error');
    }
}

// Cargar filtro de carreras
async function cargarFiltroCarreras(contexto = 'alumnos') {
    try {
        carrerasDisponibles = await CarreraService.listarTodas();
        const select = document.getElementById(`filtro-carrera-${contexto}`);

        if (select) {
            select.innerHTML = '<option value="">Todas las Carreras</option>' +
                carrerasDisponibles.map(c =>
                    `<option value="${c.id}">${c.nombreCarrera}</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Error al cargar carreras:', error);
    }
}

// Filtrar alumnos por carrera
async function filtrarAlumnosPorCarrera() {
    const carreraId = document.getElementById('filtro-carrera-alumnos').value;

    try {
        if (carreraId) {
            alumnos = await AlumnoService.obtenerPorCarrera(carreraId);
        } else {
            alumnos = await AlumnoService.listarTodos();
        }
        renderizarAlumnos();
    } catch (error) {
        console.error('Error al filtrar alumnos:', error);
        mostrarAlerta('Error al filtrar los alumnos', 'error');
    }
}

// Buscar alumnos por nombre
function buscarAlumnos() {
    const termino = document.getElementById('buscar-alumnos').value.toLowerCase();

    if (!termino) {
        renderizarAlumnos();
        return;
    }

    const alumnosFiltrados = alumnos.filter(alumno =>
        alumno.nombreCompleto.toLowerCase().includes(termino) ||
        alumno.correo.toLowerCase().includes(termino)
    );

    renderizarAlumnos(alumnosFiltrados);
}

// Renderizar tabla de alumnos
function renderizarAlumnos(datosAlumnos = alumnos) {
    const tbody = document.getElementById('alumnos-tbody');

    if (!datosAlumnos || datosAlumnos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                    No hay alumnos registrados
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = datosAlumnos.map(alumno => `
        <tr>
            <td>${alumno.id}</td>
            <td>
                <strong>${alumno.nombreCompleto}</strong>
            </td>
            <td>
                <a href="mailto:${alumno.correo}" style="color: var(--primary-color);">
                    ${alumno.correo}
                </a>
            </td>
            <td>${formatearFecha(alumno.fechaNacimiento)}</td>
            <td>
                ${alumno.carrera ?
                    `<span class="badge">${alumno.carrera.nombreCarrera}</span>` :
                    '<span style="color: var(--warning-color);">Sin asignar</span>'
                }
            </td>
            <td>
                <div class="action-buttons">
                    ${!alumno.carrera ?
                        crearBotonAccion('Asignar', 'fa-link', 'btn-success', `asignarCarreraAAlumno(${alumno.id})`) : ''
                    }
                    ${crearBotonAccion('Editar', 'fa-edit', 'btn-secondary', `editarAlumno(${alumno.id})`)}
                    ${crearBotonAccion('Eliminar', 'fa-trash', 'btn-danger', `eliminarAlumno(${alumno.id})`)}
                </div>
            </td>
        </tr>
    `).join('');
}

// Abrir modal para nuevo alumno
function abrirModalAlumno() {
    alumnoEditando = null;
    const contenido = `
        <form onsubmit="guardarAlumno(event)">
            <div class="form-group">
                <label for="nombreCompleto">Nombre Completo *</label>
                <input type="text" id="nombreCompleto" name="nombreCompleto" required
                       placeholder="Ej: Juan Carlos Pérez López">
            </div>

            <div class="form-group">
                <label for="correo">Correo Electrónico *</label>
                <input type="email" id="correo" name="correo" required
                       placeholder="Ej: juan.perez@email.com">
            </div>

            <div class="form-group">
                <label for="fechaNacimiento">Fecha de Nacimiento *</label>
                <input type="date" id="fechaNacimiento" name="fechaNacimiento" required>
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

    abrirModal('Nuevo Alumno', contenido);

    setTimeout(() => {
        document.getElementById('nombreCompleto').focus();
    }, 100);
}

// Editar alumno
async function editarAlumno(id) {
    try {
        alumnoEditando = await AlumnoService.obtenerPorId(id);

        const contenido = `
            <form onsubmit="guardarAlumno(event)">
                <div class="form-group">
                    <label for="nombreCompleto">Nombre Completo *</label>
                    <input type="text" id="nombreCompleto" name="nombreCompleto" required
                           value="${alumnoEditando.nombreCompleto}"
                           placeholder="Ej: Juan Carlos Pérez López">
                </div>

                <div class="form-group">
                    <label for="correo">Correo Electrónico *</label>
                    <input type="email" id="correo" name="correo" required
                           value="${alumnoEditando.correo}"
                           placeholder="Ej: juan.perez@email.com">
                </div>

                <div class="form-group">
                    <label for="fechaNacimiento">Fecha de Nacimiento *</label>
                    <input type="date" id="fechaNacimiento" name="fechaNacimiento" required
                           value="${alumnoEditando.fechaNacimiento}">
                </div>

                <div class="form-group">
                    <label for="carreraId">Carrera</label>
                    <select id="carreraId" name="carreraId">
                        <option value="">Seleccionar carrera...</option>
                        ${carrerasDisponibles.map(c =>
                            `<option value="${c.id}" ${alumnoEditando.carrera?.id === c.id ? 'selected' : ''}>
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

        abrirModal('Editar Alumno', contenido);

        setTimeout(() => {
            document.getElementById('nombreCompleto').focus();
            document.getElementById('nombreCompleto').select();
        }, 100);

    } catch (error) {
        console.error('Error al obtener alumno:', error);
        mostrarAlerta('Error al obtener los datos del alumno', 'error');
    }
}

// Guardar alumno (crear o actualizar)
async function guardarAlumno(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const alumnoData = {
        nombreCompleto: formData.get('nombreCompleto').trim(),
        correo: formData.get('correo').trim(),
        fechaNacimiento: formData.get('fechaNacimiento'),
        carrera: formData.get('carreraId') ? { id: parseInt(formData.get('carreraId')) } : null
    };

    // Validaciones
    if (!alumnoData.nombreCompleto) {
        mostrarAlerta('El nombre completo es obligatorio', 'error');
        return;
    }

    if (!alumnoData.correo) {
        mostrarAlerta('El correo electrónico es obligatorio', 'error');
        return;
    }

    if (!alumnoData.fechaNacimiento) {
        mostrarAlerta('La fecha de nacimiento es obligatoria', 'error');
        return;
    }

    try {
        if (alumnoEditando) {
            // Actualizar
            await AlumnoService.actualizar(alumnoEditando.id, alumnoData);
            mostrarAlerta('Alumno actualizado correctamente', 'success');
        } else {
            // Crear
            await AlumnoService.crear(alumnoData);
            mostrarAlerta('Alumno creado correctamente', 'success');
        }

        cerrarModal();
        await cargarAlumnos();

    } catch (error) {
        console.error('Error al guardar alumno:', error);
        mostrarAlerta('Error al guardar el alumno', 'error');
    }
}

// Asignar carrera a alumno
async function asignarCarreraAAlumno(alumnoId) {
    const alumno = alumnos.find(a => a.id === alumnoId);
    if (!alumno) return;

    const contenido = `
        <form onsubmit="confirmarAsignacionCarrera(event, ${alumnoId})">
            <p>Asignar carrera al alumno: <strong>${alumno.nombreCompleto}</strong></p>

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

// Confirmar asignación de carrera
async function confirmarAsignacionCarrera(event, alumnoId) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const carreraId = parseInt(formData.get('carreraId'));

    if (!carreraId) {
        mostrarAlerta('Debes seleccionar una carrera', 'error');
        return;
    }

    try {
        await AlumnoService.asignarCarrera(alumnoId, carreraId);
        mostrarAlerta('Carrera asignada correctamente', 'success');
        cerrarModal();
        await cargarAlumnos();
    } catch (error) {
        console.error('Error al asignar carrera:', error);
        mostrarAlerta('Error al asignar la carrera', 'error');
    }
}

// Eliminar alumno
async function eliminarAlumno(id) {
    const alumno = alumnos.find(a => a.id === id);
    if (!alumno) return;

    confirmarEliminacion(`el alumno "${alumno.nombreCompleto}"`, async () => {
        try {
            await AlumnoService.eliminar(id);
            mostrarAlerta('Alumno eliminado correctamente', 'success');
            await cargarAlumnos();
        } catch (error) {
            console.error('Error al eliminar alumno:', error);
            mostrarAlerta('Error al eliminar el alumno', 'error');
        }
    });
}