package com.neisser.springboot_plantilla.controller;

import com.neisser.springboot_plantilla.entity.Asistencia;
import com.neisser.springboot_plantilla.service.AsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/asistencias")
public class AsistenciaController {

    @Autowired
    private AsistenciaService asistenciaService;


    @GetMapping
    public ResponseEntity<List<Asistencia>> listarAsistencias() {
        List<Asistencia> listaAsistencias = asistenciaService.listarTodasLasAsistencias();
        return ResponseEntity.ok(listaAsistencias);
    }


    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<List<Asistencia>> obtenerAsistenciasPorAlumno(@PathVariable Long idAlumno) {
        List<Asistencia> listaAsistencias = asistenciaService.obtenerAsistenciasPorAlumno(idAlumno);
        return ResponseEntity.ok(listaAsistencias);
    }


    @GetMapping("/asignatura/{idAsignatura}")
    public ResponseEntity<List<Asistencia>> obtenerAsistenciasPorAsignatura(@PathVariable Long idAsignatura) {
        List<Asistencia> listaAsistencias = asistenciaService.obtenerAsistenciasPorAsignatura(idAsignatura);
        return ResponseEntity.ok(listaAsistencias);
    }


    @PostMapping
    public ResponseEntity<Asistencia> guardarAsistencia(@RequestBody Asistencia nuevaAsistencia) {

        if (nuevaAsistencia.getAlumno() != null && nuevaAsistencia.getAlumno().getId() == null) {
            nuevaAsistencia.setAlumno(null);
        }
        if (nuevaAsistencia.getAsignatura() != null && nuevaAsistencia.getAsignatura().getId() == null) {
            nuevaAsistencia.setAsignatura(null);
        }

        Asistencia asistenciaGuardada = asistenciaService.agregarAsistencia(nuevaAsistencia);
        return ResponseEntity.ok(asistenciaGuardada);
    }


    @PatchMapping("/{idAsistencia}/alumno")
    public ResponseEntity<Asistencia> asignarAlumnoAAsistencia(
            @PathVariable Long idAsistencia,
            @RequestBody Map<String, Long> solicitud) {
        Long idAlumno = solicitud.get("alumnoId");
        Asistencia asistenciaActualizada = asistenciaService.asignarAlumnoAAsistencia(idAsistencia, idAlumno);
        return ResponseEntity.ok(asistenciaActualizada);
    }


    @PatchMapping("/{idAsistencia}/asignatura")
    public ResponseEntity<Asistencia> asignarAsignaturaAAsistencia(
            @PathVariable Long idAsistencia,
            @RequestBody Map<String, Long> solicitud) {
        Long idAsignatura = solicitud.get("asignaturaId");
        Asistencia asistenciaActualizada = asistenciaService.asignarAsignaturaAAsistencia(idAsistencia, idAsignatura);
        return ResponseEntity.ok(asistenciaActualizada);
    }


    @PutMapping("/{idAsistencia}")
    public ResponseEntity<Asistencia> actualizarAsistencia(@PathVariable Long idAsistencia, @RequestBody Asistencia datosAsistencia) {
        Asistencia asistenciaActualizada = asistenciaService.actualizarAsistencia(idAsistencia, datosAsistencia);
        return ResponseEntity.ok(asistenciaActualizada);
    }


    @DeleteMapping("/{idAsistencia}")
    public ResponseEntity<Void> eliminarAsistencia(@PathVariable Long idAsistencia) {
        asistenciaService.eliminarAsistencia(idAsistencia);
        return ResponseEntity.ok().build();
    }
}
