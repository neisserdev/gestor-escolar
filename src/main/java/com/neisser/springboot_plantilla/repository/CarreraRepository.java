package com.neisser.springboot_plantilla.repository;

import com.neisser.springboot_plantilla.entity.Carrera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarreraRepository extends JpaRepository<Carrera, Long> {

    List<Carrera> findByFacultadId(Long facultadId);

    List<Carrera> findByFacultadIsNull();

    Optional<Carrera> findByNombreCarrera(String nombreCarrera);

    @Query("SELECT c FROM Carrera c LEFT JOIN FETCH c.alumnos WHERE c.id = :id")
    Optional<Carrera> findByIdWithAlumnos(@Param("id") Long id);

    @Query("SELECT c FROM Carrera c LEFT JOIN FETCH c.asignaturas WHERE c.id = :id")
    Optional<Carrera> findByIdWithAsignaturas(@Param("id") Long id);

    boolean existsByNombreCarrera(String nombreCarrera);
}
