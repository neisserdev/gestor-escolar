package com.neisser.springboot_plantilla.service;

import com.neisser.springboot_plantilla.entity.Asistencia;
import com.neisser.springboot_plantilla.entity.Alumno;
import com.neisser.springboot_plantilla.entity.Asignatura;
import com.neisser.springboot_plantilla.exception.EntityNotFoundException;
import com.neisser.springboot_plantilla.repository.AsistenciaRepository;
import com.neisser.springboot_plantilla.repository.AlumnoRepository;
import com.neisser.springboot_plantilla.repository.AsignaturaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class AsistenciaService {

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    public List<Asistencia> listarTodasLasAsistencias() {
        return asistenciaRepository.findAll();
    }

    public List<Asistencia> obtenerAsistenciasPorAlumno(Long idAlumno) {
        return asistenciaRepository.findByAlumnoId(idAlumno);
    }

    public List<Asistencia> obtenerAsistenciasPorAsignatura(Long idAsignatura) {
        return asistenciaRepository.findByAsignaturaId(idAsignatura);
    }

    public Asistencia agregarAsistencia(Asistencia nuevaAsistencia) {
        if (nuevaAsistencia.getAlumno() != null && nuevaAsistencia.getAlumno().getId() != null &&
                !alumnoRepository.existsById(nuevaAsistencia.getAlumno().getId())) {
            throw new EntityNotFoundException("Alumno no encontrado");
        }
        if (nuevaAsistencia.getAsignatura() != null && nuevaAsistencia.getAsignatura().getId() != null &&
                !asignaturaRepository.existsById(nuevaAsistencia.getAsignatura().getId())) {
            throw new EntityNotFoundException("Asignatura no encontrada");
        }

        if (nuevaAsistencia.getAlumno() != null && nuevaAsistencia.getAlumno().getId() == null) {
            nuevaAsistencia.setAlumno(null);
        }
        if (nuevaAsistencia.getAsignatura() != null && nuevaAsistencia.getAsignatura().getId() == null) {
            nuevaAsistencia.setAsignatura(null);
        }

        return asistenciaRepository.save(nuevaAsistencia);
    }

    public Asistencia asignarAlumnoAAsistencia(Long idAsistencia, Long idAlumno) {
        Asistencia asistenciaExistente = asistenciaRepository.findById(idAsistencia)
                .orElseThrow(() -> new EntityNotFoundException("Asistencia no encontrada con id: " + idAsistencia));

        Alumno alumnoExistente = alumnoRepository.findById(idAlumno)
                .orElseThrow(() -> new EntityNotFoundException("Alumno no encontrado con id: " + idAlumno));

        asistenciaExistente.setAlumno(alumnoExistente);
        return asistenciaRepository.save(asistenciaExistente);
    }

    public Asistencia asignarAsignaturaAAsistencia(Long idAsistencia, Long idAsignatura) {
        Asistencia asistenciaExistente = asistenciaRepository.findById(idAsistencia)
                .orElseThrow(() -> new EntityNotFoundException("Asistencia no encontrada con id: " + idAsistencia));

        Asignatura asignaturaExistente = asignaturaRepository.findById(idAsignatura)
                .orElseThrow(() -> new EntityNotFoundException("Asignatura no encontrada con id: " + idAsignatura));

        asistenciaExistente.setAsignatura(asignaturaExistente);
        return asistenciaRepository.save(asistenciaExistente);
    }

    public Asistencia actualizarAsistencia(Long idAsistencia, Asistencia datosAsistencia) {
        return asistenciaRepository.findById(idAsistencia)
                .map(asistenciaExistente -> {
                    asistenciaExistente.setFechaAsistencia(datosAsistencia.getFechaAsistencia());
                    asistenciaExistente.setPresente(datosAsistencia.getPresente());

                    if (datosAsistencia.getAlumno() != null && datosAsistencia.getAlumno().getId() != null) {
                        if (!alumnoRepository.existsById(datosAsistencia.getAlumno().getId())) {
                            throw new EntityNotFoundException("Alumno no encontrado");
                        }
                        asistenciaExistente.setAlumno(datosAsistencia.getAlumno());
                    }
                    if (datosAsistencia.getAsignatura() != null && datosAsistencia.getAsignatura().getId() != null) {
                        if (!asignaturaRepository.existsById(datosAsistencia.getAsignatura().getId())) {
                            throw new EntityNotFoundException("Asignatura no encontrada");
                        }
                        asistenciaExistente.setAsignatura(datosAsistencia.getAsignatura());
                    }

                    return asistenciaRepository.save(asistenciaExistente);
                })
                .orElseThrow(() -> new EntityNotFoundException("Asistencia no encontrada con id: " + idAsistencia));
    }

    public void eliminarAsistencia(Long idAsistencia) {
        if (!asistenciaRepository.existsById(idAsistencia)) {
            throw new EntityNotFoundException("Asistencia no encontrada con id: " + idAsistencia);
        }
        asistenciaRepository.deleteById(idAsistencia);
    }
}
