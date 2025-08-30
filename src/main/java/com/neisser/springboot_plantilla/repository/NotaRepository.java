package com.neisser.springboot_plantilla.repository;

import com.neisser.springboot_plantilla.entity.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {

    List<Nota> findByAlumnoId(Long alumnoId);

    List<Nota> findByAsignaturaId(Long asignaturaId);

    List<Nota> findByAlumnoIsNull();

    List<Nota> findByAsignaturaIsNull();

    List<Nota> findByProfesorIsNull();

    List<Nota> findByTipo(Nota.Tipo tipo);

    @Query("SELECT AVG(n.valor) FROM Nota n WHERE n.alumno.id = :alumnoId")
    Double calcularPromedioByAlumnoId(@Param("alumnoId") Long alumnoId);

    @Query("SELECT AVG(n.valor) FROM Nota n WHERE n.alumno.id = :alumnoId AND n.asignatura.id = :asignaturaId")
    Double calcularPromedioByAlumnoIdAndAsignaturaId(@Param("alumnoId") Long alumnoId, @Param("asignaturaId") Long asignaturaId);

    @Query("SELECT AVG(n.valor) FROM Nota n WHERE n.asignatura.id = :asignaturaId")
    Double calcularPromedioByAsignaturaId(@Param("asignaturaId") Long asignaturaId);
}