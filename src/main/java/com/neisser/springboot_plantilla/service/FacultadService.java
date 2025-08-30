package com.neisser.springboot_plantilla.service;

import com.neisser.springboot_plantilla.entity.Facultad;
import com.neisser.springboot_plantilla.exception.EntityAlreadyExistsException;
import com.neisser.springboot_plantilla.exception.EntityNotFoundException;
import com.neisser.springboot_plantilla.repository.FacultadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class FacultadService {

    @Autowired
    private FacultadRepository facultadRepository;

    public List<Facultad> listarTodasLasFacultades() {
        return facultadRepository.findAll();
    }

    public Optional<Facultad> obtenerFacultadPorId(Long idFacultad) {
        return facultadRepository.findById(idFacultad);
    }

    public Facultad agregarFacultad(Facultad nuevaFacultad) {
        if (facultadRepository.existsByNombreFacultad(nuevaFacultad.getNombreFacultad())) {
            throw new EntityAlreadyExistsException("Ya existe una facultad con ese nombre");
        }
        return facultadRepository.save(nuevaFacultad);
    }

    public Facultad actualizarFacultad(Long idFacultad, Facultad datosFacultad) {
        return facultadRepository.findById(idFacultad)
                .map(facultadExistente -> {
                    facultadExistente.setNombreFacultad(datosFacultad.getNombreFacultad());
                    return facultadRepository.save(facultadExistente);
                })
                .orElseThrow(() -> new EntityNotFoundException("Facultad no encontrada con id: " + idFacultad));
    }

    public void eliminarFacultad(Long idFacultad) {
        if (!facultadRepository.existsById(idFacultad)) {
            throw new EntityNotFoundException("Facultad no encontrada con id: " + idFacultad);
        }
        facultadRepository.deleteById(idFacultad);
    }
}