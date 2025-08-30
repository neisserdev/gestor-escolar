package com.neisser.springboot_plantilla.service;

import com.neisser.springboot_plantilla.entity.Asignatura;
import com.neisser.springboot_plantilla.entity.Carrera;
import com.neisser.springboot_plantilla.exception.EntityAlreadyExistsException;
import com.neisser.springboot_plantilla.exception.EntityNotFoundException;
import com.neisser.springboot_plantilla.repository.AsignaturaRepository;
import com.neisser.springboot_plantilla.repository.CarreraRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AsignaturaService {

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    @Autowired
    private CarreraRepository carreraRepository;

    public List<Asignatura> listarTodasLasAsignaturas() {
        return asignaturaRepository.findAll();
    }

    public Optional<Asignatura> obtenerAsignaturaPorId(Long idAsignatura) {
        return asignaturaRepository.findById(idAsignatura);
    }

    public List<Asignatura> obtenerAsignaturasPorCarrera(Long idCarrera) {
        return asignaturaRepository.findByCarreraId(idCarrera);
    }

    public Asignatura agregarAsignatura(Asignatura nuevaAsignatura) {
        if (nuevaAsignatura.getCarrera() != null && nuevaAsignatura.getCarrera().getId() != null &&
                !carreraRepository.existsById(nuevaAsignatura.getCarrera().getId())) {
            throw new EntityNotFoundException("Carrera no encontrada");
        }

        if (asignaturaRepository.existsByNombreAsignatura(nuevaAsignatura.getNombreAsignatura())) {
            throw new EntityAlreadyExistsException("Ya existe una asignatura con ese nombre");
        }

        if (nuevaAsignatura.getCarrera() != null && nuevaAsignatura.getCarrera().getId() == null) {
            nuevaAsignatura.setCarrera(null);
        }

        return asignaturaRepository.save(nuevaAsignatura);
    }

    public Asignatura asignarCarreraAAsignatura(Long idAsignatura, Long idCarrera) {
        Asignatura asignaturaExistente = asignaturaRepository.findById(idAsignatura)
                .orElseThrow(() -> new EntityNotFoundException("Asignatura no encontrada con id: " + idAsignatura));

        Carrera carreraExistente = carreraRepository.findById(idCarrera)
                .orElseThrow(() -> new EntityNotFoundException("Carrera no encontrada con id: " + idCarrera));

        asignaturaExistente.setCarrera(carreraExistente);
        return asignaturaRepository.save(asignaturaExistente);
    }

    public Asignatura actualizarAsignatura(Long idAsignatura, Asignatura datosAsignatura) {
        return asignaturaRepository.findById(idAsignatura)
                .map(asignaturaExistente -> {
                    asignaturaExistente.setNombreAsignatura(datosAsignatura.getNombreAsignatura());

                    if (datosAsignatura.getCarrera() != null && datosAsignatura.getCarrera().getId() != null) {
                        if (!carreraRepository.existsById(datosAsignatura.getCarrera().getId())) {
                            throw new EntityNotFoundException("Carrera no encontrada");
                        }
                        asignaturaExistente.setCarrera(datosAsignatura.getCarrera());
                    }

                    return asignaturaRepository.save(asignaturaExistente);
                })
                .orElseThrow(() -> new EntityNotFoundException("Asignatura no encontrada con id: " + idAsignatura));
    }

    public void eliminarAsignatura(Long idAsignatura) {
        if (!asignaturaRepository.existsById(idAsignatura)) {
            throw new EntityNotFoundException("Asignatura no encontrada con id: " + idAsignatura);
        }
        asignaturaRepository.deleteById(idAsignatura);
    }
}