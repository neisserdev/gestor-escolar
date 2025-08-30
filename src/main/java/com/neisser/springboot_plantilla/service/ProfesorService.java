package com.neisser.springboot_plantilla.service;

import com.neisser.springboot_plantilla.entity.Profesor;
import com.neisser.springboot_plantilla.exception.EntityAlreadyExistsException;
import com.neisser.springboot_plantilla.exception.EntityNotFoundException;
import com.neisser.springboot_plantilla.repository.ProfesorRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProfesorService {

    @Autowired
    private ProfesorRepository profesorRepository;

    public List<Profesor> listarTodosLosProfesores() {
        return profesorRepository.findAll();
    }

    public Optional<Profesor> obtenerProfesorPorId(Long idProfesor) {
        return profesorRepository.findById(idProfesor);
    }

    public Profesor agregarProfesor(Profesor nuevoProfesor) {
        if (profesorRepository.existsByCorreo(nuevoProfesor.getCorreo())) {
            throw new EntityAlreadyExistsException("Ya existe un profesor con ese correo");
        }

        return profesorRepository.save(nuevoProfesor);
    }

    public Profesor actualizarProfesor(Long idProfesor, Profesor datosProfesor) {
        return profesorRepository.findById(idProfesor)
                .map(profesorExistente -> {
                    profesorExistente.setNombreCompleto(datosProfesor.getNombreCompleto());
                    profesorExistente.setFechaNacimiento(datosProfesor.getFechaNacimiento());
                    profesorExistente.setCorreo(datosProfesor.getCorreo());

                    return profesorRepository.save(profesorExistente);
                })
                .orElseThrow(() -> new EntityNotFoundException("Profesor no encontrado con id: " + idProfesor));
    }

    public void eliminarProfesor(Long idProfesor) {
        if (!profesorRepository.existsById(idProfesor)) {
            throw new EntityNotFoundException("Profesor no encontrado con id: " + idProfesor);
        }
        profesorRepository.deleteById(idProfesor);
    }
}
