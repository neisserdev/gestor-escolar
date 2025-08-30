// Configuración de la API
const API_CONFIG = {
    baseURL: 'http://localhost:5786', // Cambia por la URL de tu API
    timeout: 10000
};

// Utilidades de API
class ApiClient {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            mostrarCargando(true);
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json().catch(() => null);
            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            mostrarAlerta(error.message, 'error');
            throw error;
        } finally {
            mostrarCargando(false);
        }
    }

    // Métodos HTTP
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Instancia global del cliente API
const api = new ApiClient();

// Servicios específicos por entidad
const FacultadService = {
    async listarTodas() {
        return api.get('/facultades');
    },

    async obtenerPorId(id) {
        return api.get(`/facultades/${id}`);
    },

    async crear(facultad) {
        return api.post('/facultades', facultad);
    },

    async actualizar(id, facultad) {
        return api.put(`/facultades/${id}`, facultad);
    },

    async eliminar(id) {
        return api.delete(`/facultades/${id}`);
    }
};

const CarreraService = {
    async listarTodas() {
        return api.get('/carreras');
    },

    async obtenerPorId(id) {
        return api.get(`/carreras/${id}`);
    },

    async obtenerPorFacultad(facultadId) {
        return api.get(`/carreras/facultad/${facultadId}`);
    },

    async crear(carrera) {
        return api.post('/carreras', carrera);
    },

    async actualizar(id, carrera) {
        return api.put(`/carreras/${id}`, carrera);
    },

    async asignarFacultad(id, facultadId) {
        return api.patch(`/carreras/${id}/facultad`, { facultadId });
    },

    async eliminar(id) {
        return api.delete(`/carreras/${id}`);
    }
};

const AlumnoService = {
    async listarTodos() {
        return api.get('/alumnos');
    },

    async obtenerPorId(id) {
        return api.get(`/alumnos/${id}`);
    },

    async obtenerPorCarrera(carreraId) {
        return api.get(`/alumnos/carrera/${carreraId}`);
    },

    async crear(alumno) {
        return api.post('/alumnos', alumno);
    },

    async actualizar(id, alumno) {
        return api.put(`/alumnos/${id}`, alumno);
    },

    async asignarCarrera(id, carreraId) {
        return api.patch(`/alumnos/${id}/carrera`, { carreraId });
    },

    async eliminar(id) {
        return api.delete(`/alumnos/${id}`);
    }
};

const ProfesorService = {
    async listarTodos() {
        return api.get('/profesores');
    },

    async obtenerPorId(id) {
        return api.get(`/profesores/${id}`);
    },

    async crear(profesor) {
        return api.post('/profesores', profesor);
    },

    async actualizar(id, profesor) {
        return api.put(`/profesores/${id}`, profesor);
    },

    async eliminar(id) {
        return api.delete(`/profesores/${id}`);
    }
};

const AsignaturaService = {
    async listarTodas() {
        return api.get('/asignaturas');
    },

    async obtenerPorId(id) {
        return api.get(`/asignaturas/${id}`);
    },

    async obtenerPorCarrera(carreraId) {
        return api.get(`/asignaturas/carrera/${carreraId}`);
    },

    async crear(asignatura) {
        return api.post('/asignaturas', asignatura);
    },

    async actualizar(id, asignatura) {
        return api.put(`/asignaturas/${id}`, asignatura);
    },

    async asignarCarrera(id, carreraId) {
        return api.patch(`/asignaturas/${id}/carrera`, { carreraId });
    },

    async eliminar(id) {
        return api.delete(`/asignaturas/${id}`);
    }
};

const NotaService = {
    async listarTodas() {
        return api.get('/notas');
    },

    async obtenerPorAlumno(alumnoId) {
        return api.get(`/notas/alumno/${alumnoId}`);
    },

    async obtenerPorAsignatura(asignaturaId) {
        return api.get(`/notas/asignatura/${asignaturaId}`);
    },

    async obtenerPromedioAlumno(alumnoId) {
        return api.get(`/notas/alumno/${alumnoId}/promedio`);
    },

    async crear(nota) {
        return api.post('/notas', nota);
    },

    async actualizar(id, nota) {
        return api.put(`/notas/${id}`, nota);
    },

    async asignarAlumno(id, alumnoId) {
        return api.patch(`/notas/${id}/alumno`, { alumnoId });
    },

    async asignarAsignatura(id, asignaturaId) {
        return api.patch(`/notas/${id}/asignatura`, { asignaturaId });
    },

    async asignarProfesor(id, profesorId) {
        return api.patch(`/notas/${id}/profesor`, { profesorId });
    },

    async eliminar(id) {
        return api.delete(`/notas/${id}`);
    }
};

const AsistenciaService = {
    async listarTodas() {
        return api.get('/asistencias');
    },

    async obtenerPorAlumno(alumnoId) {
        return api.get(`/asistencias/alumno/${alumnoId}`);
    },

    async obtenerPorAsignatura(asignaturaId) {
        return api.get(`/asistencias/asignatura/${asignaturaId}`);
    },

    async crear(asistencia) {
        return api.post('/asistencias', asistencia);
    },

    async actualizar(id, asistencia) {
        return api.put(`/asistencias/${id}`, asistencia);
    },

    async asignarAlumno(id, alumnoId) {
        return api.patch(`/asistencias/${id}/alumno`, { alumnoId });
    },

    async asignarAsignatura(id, asignaturaId) {
        return api.patch(`/asistencias/${id}/asignatura`, { asignaturaId });
    },

    async eliminar(id) {
        return api.delete(`/asistencias/${id}`);
    }
};