package com.neisser.springboot_plantilla.service;

import com.neisser.springboot_plantilla.entity.Carrera;
import com.neisser.springboot_plantilla.entity.Facultad;
import com.neisser.springboot_plantilla.exception.EntityAlreadyExistsException;
import com.neisser.springboot_plantilla.exception.EntityNotFoundException;
import com.neisser.springboot_plantilla.repository.CarreraRepository;
import com.neisser.springboot_plantilla.repository.FacultadRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CarreraService {

    @Autowired
    private CarreraRepository carreraRepository;

    @Autowired
    private FacultadRepository facultadRepository;

    public List<Carrera> listarTodasLasCarreras() {
        return carreraRepository.findAll();
    }

    public Optional<Carrera> obtenerCarreraPorId(Long idCarrera) {
        return carreraRepository.findById(idCarrera);
    }

    public List<Carrera> obtenerCarrerasPorFacultad(Long idFacultad) {
        return carreraRepository.findByFacultadId(idFacultad);
    }

    public Carrera agregarCarrera(Carrera nuevaCarrera) {
        if (nuevaCarrera.getFacultad() != null && nuevaCarrera.getFacultad().getId() != null &&
                !facultadRepository.existsById(nuevaCarrera.getFacultad().getId())) {
            throw new EntityNotFoundException("Facultad no encontrada");
        }

        if (carreraRepository.existsByNombreCarrera(nuevaCarrera.getNombreCarrera())) {
            throw new EntityAlreadyExistsException("Ya existe una carrera con ese nombre");
        }

        if (nuevaCarrera.getFacultad() != null && nuevaCarrera.getFacultad().getId() == null) {
            nuevaCarrera.setFacultad(null);
        }

        return carreraRepository.save(nuevaCarrera);
    }

    public Carrera asignarFacultadACarrera(Long idCarrera, Long idFacultad) {
        Carrera carreraExistente = carreraRepository.findById(idCarrera)
                .orElseThrow(() -> new EntityNotFoundException("Carrera no encontrada con id: " + idCarrera));

        Facultad facultadExistente = facultadRepository.findById(idFacultad)
                .orElseThrow(() -> new EntityNotFoundException("Facultad no encontrada con id: " + idFacultad));

        carreraExistente.setFacultad(facultadExistente);
        return carreraRepository.save(carreraExistente);
    }

    public Carrera actualizarCarrera(Long idCarrera, Carrera datosCarrera) {
        return carreraRepository.findById(idCarrera)
                .map(carreraExistente -> {
                    carreraExistente.setNombreCarrera(datosCarrera.getNombreCarrera());

                    if (datosCarrera.getFacultad() != null && datosCarrera.getFacultad().getId() != null) {
                        if (!facultadRepository.existsById(datosCarrera.getFacultad().getId())) {
                            throw new EntityNotFoundException("Facultad no encontrada");
                        }
                        carreraExistente.setFacultad(datosCarrera.getFacultad());
                    }

                    return carreraRepository.save(carreraExistente);
                })
                .orElseThrow(() -> new EntityNotFoundException("Carrera no encontrada con id: " + idCarrera));
    }

    public void eliminarCarrera(Long idCarrera) {
        if (!carreraRepository.existsById(idCarrera)) {
            throw new EntityNotFoundException("Carrera no encontrada con id: " + idCarrera);
        }
        carreraRepository.deleteById(idCarrera);
    }
}