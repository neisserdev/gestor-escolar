package com.neisser.springboot_plantilla.repository;

import com.neisser.springboot_plantilla.entity.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    List<Asistencia> findByAlumnoId(Long alumnoId);

    List<Asistencia> findByAsignaturaId(Long asignaturaId);

    List<Asistencia> findByAlumnoIsNull();

    List<Asistencia> findByAsignaturaIsNull();

    List<Asistencia> findByFechaAsistencia(Date fecha);

    List<Asistencia> findByPresente(Boolean presente);

    List<Asistencia> findByPresenteIsNull();

    @Query("SELECT (COUNT(a) * 100.0 / (SELECT COUNT(aa) FROM Asistencia aa WHERE aa.alumno.id = :alumnoId)) FROM Asistencia a WHERE a.alumno.id = :alumnoId AND a.presente = true")
    Double calcularPorcentajeAsistenciaByAlumnoId(@Param("alumnoId") Long alumnoId);
}
