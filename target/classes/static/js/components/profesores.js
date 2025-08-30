// Variables para profesores
let profesores = [];
let profesorEditando = null;

// Cargar profesores
async function cargarProfesores() {
    try {
        profesores = await ProfesorService.listarTodos();
        renderizarProfesores();
    } catch (error) {
        console.error('Error al cargar profesores:', error);
        mostrarAlerta('Error al cargar los profesores', 'error');
    }
}

// Renderizar tabla de profesores
function renderizarProfesores() {
    const tbody = document.getElementById('profesores-tbody');

    if (!profesores || profesores.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                    No hay profesores registrados
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = profesores.map(profesor => `
        <tr>
            <td>${profesor.id}</td>
            <td>
                <strong>${profesor.nombreCompleto}</strong>
            </td>
            <td>
                <a href="mailto:${profesor.correo}" style="color: var(--primary-color);">
                    ${profesor.correo}
                </a>
            </td>
            <td>${formatearFecha(profesor.fechaNacimiento)}</td>
            <td>
                <div class="action-buttons">
                    ${crearBotonAccion('Editar', 'fa-edit', 'btn-secondary', `editarProfesor(${profesor.id})`)}
                    ${crearBotonAccion('Eliminar', 'fa-trash', 'btn-danger', `eliminarProfesor(${profesor.id})`)}
                </div>
            </td>
        </tr>
    `).join('');
}

// Abrir modal para nuevo profesor
function abrirModalProfesor() {
    profesorEditando = null;
    const contenido = `
        <form onsubmit="guardarProfesor(event)">
            <div class="form-group">
                <label for="nombreCompleto">Nombre Completo *</label>
                <input type="text" id="nombreCompleto" name="nombreCompleto" required
                       placeholder="Ej: Dr. María Elena García">
            </div>

            <div class="form-group">
                <label for="correo">Correo Electrónico *</label>
                <input type="email" id="correo" name="correo" required
                       placeholder="Ej: maria.garcia@universidad.edu">
            </div>

            <div class="form-group">
                <label for="fechaNacimiento">Fecha de Nacimiento *</label>
                <input type="date" id="fechaNacimiento" name="fechaNacimiento" required>
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

    abrirModal('Nuevo Profesor', contenido);

    setTimeout(() => {
        document.getElementById('nombreCompleto').focus();
    }, 100);
}

// Editar profesor
async function editarProfesor(id) {
    try {
        profesorEditando = await ProfesorService.obtenerPorId(id);

        const contenido = `
            <form onsubmit="guardarProfesor(event)">
                <div class="form-group">
                    <label for="nombreCompleto">Nombre Completo *</label>
                    <input type="text" id="nombreCompleto" name="nombreCompleto" required
                           value="${profesorEditando.nombreCompleto}"
                           placeholder="Ej: Dr. María Elena García">
                </div>

                <div class="form-group">
                    <label for="correo">Correo Electrónico *</label>
                    <input type="email" id="correo" name="correo" required
                           value="${profesorEditando.correo}"
                           placeholder="Ej: maria.garcia@universidad.edu">
                </div>

                <div class="form-group">
                    <label for="fechaNacimiento">Fecha de Nacimiento *</label>
                    <input type="date" id="fechaNacimiento" name="fechaNacimiento" required
                           value="${profesorEditando.fechaNacimiento}">
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

        abrirModal('Editar Profesor', contenido);

        setTimeout(() => {
            document.getElementById('nombreCompleto').focus();
            document.getElementById('nombreCompleto').select();
        }, 100);

    } catch (error) {
        console.error('Error al obtener profesor:', error);
        mostrarAlerta('Error al obtener los datos del profesor', 'error');
    }
}

// Guardar profesor (crear o actualizar)
async function guardarProfesor(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const profesorData = {
        nombreCompleto: formData.get('nombreCompleto').trim(),
        correo: formData.get('correo').trim(),
        fechaNacimiento: formData.get('fechaNacimiento')
    };

    // Validaciones
    if (!profesorData.nombreCompleto) {
        mostrarAlerta('El nombre completo es obligatorio', 'error');
        return;
    }

    if (!profesorData.correo) {
        mostrarAlerta('El correo electrónico es obligatorio', 'error');
        return;
    }

    if (!profesorData.fechaNacimiento) {
        mostrarAlerta('La fecha de nacimiento es obligatoria', 'error');
        return;
    }

    try {
        if (profesorEditando) {
            // Actualizar
            await ProfesorService.actualizar(profesorEditando.id, profesorData);
            mostrarAlerta('Profesor actualizado correctamente', 'success');
        } else {
            // Crear
            await ProfesorService.crear(profesorData);
            mostrarAlerta('Profesor creado correctamente', 'success');
        }

        cerrarModal();
        await cargarProfesores();

    } catch (error) {
        console.error('Error al guardar profesor:', error);
        mostrarAlerta('Error al guardar el profesor', 'error');
    }
}

// Eliminar profesor
async function eliminarProfesor(id) {
    const profesor = profesores.find(p => p.id === id);
    if (!profesor) return;

    confirmarEliminacion(`el profesor "${profesor.nombreCompleto}"`, async () => {
        try {
            await ProfesorService.eliminar(id);
            mostrarAlerta('Profesor eliminado correctamente', 'success');
            await cargarProfesores();
        } catch (error) {
            console.error('Error al eliminar profesor:', error);
            mostrarAlerta('Error al eliminar el profesor', 'error');
        }
    });
}