package com.neisser.springboot_plantilla.service;

import com.neisser.springboot_plantilla.entity.Alumno;
import com.neisser.springboot_plantilla.entity.Carrera;
import com.neisser.springboot_plantilla.exception.EntityAlreadyExistsException;
import com.neisser.springboot_plantilla.exception.EntityNotFoundException;
import com.neisser.springboot_plantilla.repository.AlumnoRepository;
import com.neisser.springboot_plantilla.repository.CarreraRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private CarreraRepository carreraRepository;

    public List<Alumno> listarTodosLosAlumnos() {
        return alumnoRepository.findAll();
    }

    public Optional<Alumno> obtenerAlumnoPorId(Long idAlumno) {
        return alumnoRepository.findById(idAlumno);
    }

    public List<Alumno> obtenerAlumnosPorCarrera(Long idCarrera) {
        return alumnoRepository.findByCarreraId(idCarrera);
    }

    public Alumno agregarAlumno(Alumno nuevoAlumno) {
        if (nuevoAlumno.getCarrera() != null && nuevoAlumno.getCarrera().getId() != null &&
                !carreraRepository.existsById(nuevoAlumno.getCarrera().getId())) {
            throw new EntityNotFoundException("Carrera no encontrada");
        }

        if (alumnoRepository.existsByCorreo(nuevoAlumno.getCorreo())) {
            throw new EntityAlreadyExistsException("Ya existe un alumno con ese correo");
        }

        if (nuevoAlumno.getCarrera() != null && nuevoAlumno.getCarrera().getId() == null) {
            nuevoAlumno.setCarrera(null);
        }

        return alumnoRepository.save(nuevoAlumno);
    }

    public Alumno asignarCarreraAAlumno(Long idAlumno, Long idCarrera) {
        Alumno alumnoExistente = alumnoRepository.findById(idAlumno)
                .orElseThrow(() -> new EntityNotFoundException("Alumno no encontrado con id: " + idAlumno));

        Carrera carreraExistente = carreraRepository.findById(idCarrera)
                .orElseThrow(() -> new EntityNotFoundException("Carrera no encontrada con id: " + idCarrera));

        alumnoExistente.setCarrera(carreraExistente);
        return alumnoRepository.save(alumnoExistente);
    }

    public Alumno actualizarAlumno(Long idAlumno, Alumno datosAlumno) {
        return alumnoRepository.findById(idAlumno)
                .map(alumnoExistente -> {
                    alumnoExistente.setNombreCompleto(datosAlumno.getNombreCompleto());
                    alumnoExistente.setFechaNacimiento(datosAlumno.getFechaNacimiento());
                    alumnoExistente.setCorreo(datosAlumno.getCorreo());

                    if (datosAlumno.getCarrera() != null && datosAlumno.getCarrera().getId() != null) {
                        if (!carreraRepository.existsById(datosAlumno.getCarrera().getId())) {
                            throw new EntityNotFoundException("Carrera no encontrada");
                        }
                        alumnoExistente.setCarrera(datosAlumno.getCarrera());
                    }

                    return alumnoRepository.save(alumnoExistente);
                })
                .orElseThrow(() -> new EntityNotFoundException("Alumno no encontrado con id: " + idAlumno));
    }

    public void eliminarAlumno(Long idAlumno) {
        if (!alumnoRepository.existsById(idAlumno)) {
            throw new EntityNotFoundException("Alumno no encontrado con id: " + idAlumno);
        }
        alumnoRepository.deleteById(idAlumno);
    }
}
