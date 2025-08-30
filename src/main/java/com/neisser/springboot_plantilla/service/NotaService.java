package com.neisser.springboot_plantilla.service;

import com.neisser.springboot_plantilla.entity.Nota;
import com.neisser.springboot_plantilla.entity.Alumno;
import com.neisser.springboot_plantilla.entity.Asignatura;
import com.neisser.springboot_plantilla.entity.Profesor;
import com.neisser.springboot_plantilla.exception.EntityNotFoundException;
import com.neisser.springboot_plantilla.repository.NotaRepository;
import com.neisser.springboot_plantilla.repository.AlumnoRepository;
import com.neisser.springboot_plantilla.repository.AsignaturaRepository;
import com.neisser.springboot_plantilla.repository.ProfesorRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class NotaService {

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    @Autowired
    private ProfesorRepository profesorRepository;

    public List<Nota> listarTodasLasNotas() {
        return notaRepository.findAll();
    }

    public List<Nota> obtenerNotasPorAlumno(Long idAlumno) {
        return notaRepository.findByAlumnoId(idAlumno);
    }

    public List<Nota> obtenerNotasPorAsignatura(Long idAsignatura) {
        return notaRepository.findByAsignaturaId(idAsignatura);
    }

    public Double calcularPromedioAlumno(Long idAlumno) {
        return notaRepository.calcularPromedioByAlumnoId(idAlumno);
    }

    public Nota agregarNota(Nota nuevaNota) {
        if (nuevaNota.getAlumno() != null && nuevaNota.getAlumno().getId() != null &&
                !alumnoRepository.existsById(nuevaNota.getAlumno().getId())) {
            throw new EntityNotFoundException("Alumno no encontrado");
        }
        if (nuevaNota.getAsignatura() != null && nuevaNota.getAsignatura().getId() != null &&
                !asignaturaRepository.existsById(nuevaNota.getAsignatura().getId())) {
            throw new EntityNotFoundException("Asignatura no encontrada");
        }
        if (nuevaNota.getProfesor() != null && nuevaNota.getProfesor().getId() != null &&
                !profesorRepository.existsById(nuevaNota.getProfesor().getId())) {
            throw new EntityNotFoundException("Profesor no encontrado");
        }

        if (nuevaNota.getAlumno() != null && nuevaNota.getAlumno().getId() == null) {
            nuevaNota.setAlumno(null);
        }
        if (nuevaNota.getAsignatura() != null && nuevaNota.getAsignatura().getId() == null) {
            nuevaNota.setAsignatura(null);
        }
        if (nuevaNota.getProfesor() != null && nuevaNota.getProfesor().getId() == null) {
            nuevaNota.setProfesor(null);
        }

        return notaRepository.save(nuevaNota);
    }

    public Nota asignarAlumnoANota(Long idNota, Long idAlumno) {
        Nota notaExistente = notaRepository.findById(idNota)
                .orElseThrow(() -> new EntityNotFoundException("Nota no encontrada con id: " + idNota));

        Alumno alumnoExistente = alumnoRepository.findById(idAlumno)
                .orElseThrow(() -> new EntityNotFoundException("Alumno no encontrado con id: " + idAlumno));

        notaExistente.setAlumno(alumnoExistente);
        return notaRepository.save(notaExistente);
    }

    public Nota asignarAsignaturaANota(Long idNota, Long idAsignatura) {
        Nota notaExistente = notaRepository.findById(idNota)
                .orElseThrow(() -> new EntityNotFoundException("Nota no encontrada con id: " + idNota));

        Asignatura asignaturaExistente = asignaturaRepository.findById(idAsignatura)
                .orElseThrow(() -> new EntityNotFoundException("Asignatura no encontrada con id: " + idAsignatura));

        notaExistente.setAsignatura(asignaturaExistente);
        return notaRepository.save(notaExistente);
    }

    public Nota asignarProfesorANota(Long idNota, Long idProfesor) {
        Nota notaExistente = notaRepository.findById(idNota)
                .orElseThrow(() -> new EntityNotFoundException("Nota no encontrada con id: " + idNota));

        Profesor profesorExistente = profesorRepository.findById(idProfesor)
                .orElseThrow(() -> new EntityNotFoundException("Profesor no encontrado con id: " + idProfesor));

        notaExistente.setProfesor(profesorExistente);
        return notaRepository.save(notaExistente);
    }

    public Nota actualizarNota(Long idNota, Nota datosNota) {
        return notaRepository.findById(idNota)
                .map(notaExistente -> {
                    notaExistente.setValor(datosNota.getValor());
                    notaExistente.setTipo(datosNota.getTipo());
                    notaExistente.setFecha(datosNota.getFecha());

                    if (datosNota.getAlumno() != null && datosNota.getAlumno().getId() != null) {
                        if (!alumnoRepository.existsById(datosNota.getAlumno().getId())) {
                            throw new EntityNotFoundException("Alumno no encontrado");
                        }
                        notaExistente.setAlumno(datosNota.getAlumno());
                    }
                    if (datosNota.getAsignatura() != null && datosNota.getAsignatura().getId() != null) {
                        if (!asignaturaRepository.existsById(datosNota.getAsignatura().getId())) {
                            throw new EntityNotFoundException("Asignatura no encontrada");
                        }
                        notaExistente.setAsignatura(datosNota.getAsignatura());
                    }
                    if (datosNota.getProfesor() != null && datosNota.getProfesor().getId() != null) {
                        if (!profesorRepository.existsById(datosNota.getProfesor().getId())) {
                            throw new EntityNotFoundException("Profesor no encontrado");
                        }
                        notaExistente.setProfesor(datosNota.getProfesor());
                    }

                    return notaRepository.save(notaExistente);
                })
                .orElseThrow(() -> new EntityNotFoundException("Nota no encontrada con id: " + idNota));
    }

    public void eliminarNota(Long idNota) {
        if (!notaRepository.existsById(idNota)) {
            throw new EntityNotFoundException("Nota no encontrada con id: " + idNota);
        }
        notaRepository.deleteById(idNota);
    }
}
