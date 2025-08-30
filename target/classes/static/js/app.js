// Variables globales
let currentSection = 'facultades';
let modalAbierto = false;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

async function inicializarApp() {
    try {
        // Configurar fecha/hora en tiempo real
        actualizarFechaHora();
        setInterval(actualizarFechaHora, 1000);

        // Configurar navegación
        configurarNavegacion();

        // Cargar datos iniciales
        await cargarSeccionActual();

        console.log('✅ Aplicación inicializada correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
        mostrarAlerta('Error al cargar la aplicación', 'error');
    }
}

// Actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    const fechaFormateada = ahora.toISOString().slice(0, 19).replace('T', ' ');
    document.getElementById('currentDateTime').textContent = fechaFormateada;
}

// Configurar navegación entre secciones
function configurarNavegacion() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const seccion = this.getAttribute('data-section');
            await cambiarSeccion(seccion);
        });
    });
}

// Cambiar entre secciones
async function cambiarSeccion(nuevaSeccion) {
    if (currentSection === nuevaSeccion) return;

    try {
        // Actualizar UI
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-section="${nuevaSeccion}"]`).classList.add('active');

        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        document.getElementById(`${nuevaSeccion}-section`).classList.add('active');

        currentSection = nuevaSeccion;

        // Cargar datos de la nueva sección
        await cargarSeccionActual();

    } catch (error) {
        console.error(`Error al cambiar a sección ${nuevaSeccion}:`, error);
        mostrarAlerta('Error al cargar la sección', 'error');
    }
}

// Cargar datos de la sección actual
async function cargarSeccionActual() {
    switch (currentSection) {
        case 'facultades':
            await cargarFacultades();
            break;
        case 'carreras':
            await cargarCarreras();
            await cargarFiltroFacultades();
            break;
        case 'alumnos':
            await cargarAlumnos();
            await cargarFiltroCarreras();
            break;
        case 'profesores':
            await cargarProfesores();
            break;
        case 'asignaturas':
            await cargarAsignaturas();
            await cargarFiltroCarreras('asignaturas');
            break;
        case 'notas':
            await cargarNotas();
            await cargarFiltroAlumnos();
            await cargarFiltroAsignaturas();
            break;
        case 'asistencias':
            await cargarAsistencias();
            await cargarFiltroAlumnos('asistencias');
            await cargarFiltroAsignaturas('asistencias');
            break;
    }
}

// Utilidades de UI
function mostrarCargando(mostrar) {
    const loading = document.getElementById('loading');
    if (mostrar) {
        loading.classList.add('active');
    } else {
        loading.classList.remove('active');
    }
}

function mostrarAlerta(mensaje, tipo = 'success') {
    const alert = document.getElementById('alert');
    alert.textContent = mensaje;
    alert.className = `alert ${tipo} active`;

    setTimeout(() => {
        alert.classList.remove('active');
    }, 5000);
}

// Gestión de modales
function abrirModal(titulo, contenido) {
    document.getElementById('modal-title').textContent = titulo;
    document.getElementById('modal-body').innerHTML = contenido;
    document.getElementById('modal-overlay').classList.add('active');
    modalAbierto = true;
}

function cerrarModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    modalAbierto = false;
}

// Cerrar modal con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalAbierto) {
        cerrarModal();
    }
});

// Cerrar modal al hacer clic fuera
document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        cerrarModal();
    }
});

// Utilidades de formato
function formatearFecha(fecha) {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES');
}

function formatearNumero(numero) {
    if (numero === null || numero === undefined) return '-';
    return Number(numero).toFixed(2);
}

function crearBotonAccion(texto, icono, clase, onClick) {
    return `<button class="btn btn-sm ${clase}" onclick="${onClick}">
        <i class="fas ${icono}"></i> ${texto}
    </button>`;
}

// Confirmación de eliminación
function confirmarEliminacion(mensaje, callback) {
    if (confirm(`¿Estás seguro de que deseas eliminar ${mensaje}?`)) {
        callback();
    }
}