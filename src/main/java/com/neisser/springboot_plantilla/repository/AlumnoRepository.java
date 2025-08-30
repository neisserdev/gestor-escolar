package com.neisser.springboot_plantilla.repository;

import com.neisser.springboot_plantilla.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {

    List<Alumno> findByCarreraId(Long carreraId);

    List<Alumno> findByCarreraIsNull();

    Optional<Alumno> findByCorreo(String correo);

    List<Alumno> findByNombreCompletoContainingIgnoreCase(String nombreCompleto);

    @Query("SELECT a FROM Alumno a LEFT JOIN FETCH a.notas WHERE a.id = :id")
    Optional<Alumno> findByIdWithNotas(@Param("id") Long id);

    @Query("SELECT a FROM Alumno a LEFT JOIN FETCH a.asistencias WHERE a.id = :id")
    Optional<Alumno> findByIdWithAsistencias(@Param("id") Long id);

    boolean existsByCorreo(String correo);
}
