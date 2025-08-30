package com.neisser.springboot_plantilla.repository;

import com.neisser.springboot_plantilla.entity.Asignatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AsignaturaRepository extends JpaRepository<Asignatura, Long> {

    List<Asignatura> findByCarreraId(Long carreraId);

    List<Asignatura> findByCarreraIsNull();

    Optional<Asignatura> findByNombreAsignatura(String nombreAsignatura);

    @Query("SELECT a FROM Asignatura a JOIN a.profesores p WHERE p.id = :profesorId")
    List<Asignatura> findByProfesorId(@Param("profesorId") Long profesorId);

    @Query("SELECT a FROM Asignatura a LEFT JOIN FETCH a.notas WHERE a.id = :id")
    Optional<Asignatura> findByIdWithNotas(@Param("id") Long id);

    @Query("SELECT a FROM Asignatura a LEFT JOIN FETCH a.asistencias WHERE a.id = :id")
    Optional<Asignatura> findByIdWithAsistencias(@Param("id") Long id);

    boolean existsByNombreAsignatura(String nombreAsignatura);
}