package com.neisser.springboot_plantilla.repository;

import com.neisser.springboot_plantilla.entity.Profesor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfesorRepository extends JpaRepository<Profesor, Long> {

    List<Profesor> findByCarreraIsNull();

    Optional<Profesor> findByCorreo(String correo);

    List<Profesor> findByNombreCompletoContainingIgnoreCase(String nombreCompleto);

    @Query("SELECT p FROM Profesor p LEFT JOIN FETCH p.asignaturas WHERE p.id = :id")
    Optional<Profesor> findByIdWithAsignaturas(@Param("id") Long id);

    @Query("SELECT p FROM Profesor p LEFT JOIN FETCH p.notas WHERE p.id = :id")
    Optional<Profesor> findByIdWithNotas(@Param("id") Long id);

    boolean existsByCorreo(String correo);
}