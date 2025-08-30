package com.neisser.springboot_plantilla.repository;

import com.neisser.springboot_plantilla.entity.Facultad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultadRepository extends JpaRepository<Facultad, Long> {

    Optional<Facultad> findByNombreFacultad(String nombreFacultad);

    @Query("SELECT f FROM Facultad f LEFT JOIN FETCH f.carreras")
    List<Facultad> findAllWithCarreras();

    boolean existsByNombreFacultad(String nombreFacultad);

    List<Facultad> findByCarrerasIsNull();
}