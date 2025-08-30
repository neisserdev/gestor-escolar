package com.neisser.springboot_plantilla.controller;

import com.neisser.springboot_plantilla.entity.Nota;
import com.neisser.springboot_plantilla.service.NotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notas")
public class NotaController {

    @Autowired
    private NotaService notaService;

    @GetMapping
    public ResponseEntity<List<Nota>> listarNotas() {
        List<Nota> listaNotas = notaService.listarTodasLasNotas();
        return ResponseEntity.ok(listaNotas);
    }

    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<List<Nota>> obtenerNotasPorAlumno(@PathVariable Long idAlumno) {
        List<Nota> listaNotas = notaService.obtenerNotasPorAlumno(idAlumno);
        return ResponseEntity.ok(listaNotas);
    }

    @GetMapping("/asignatura/{idAsignatura}")
    public ResponseEntity<List<Nota>> obtenerNotasPorAsignatura(@PathVariable Long idAsignatura) {
        List<Nota> listaNotas = notaService.obtenerNotasPorAsignatura(idAsignatura);
        return ResponseEntity.ok(listaNotas);
    }

    @GetMapping("/alumno/{idAlumno}/promedio")
    public ResponseEntity<Double> obtenerPromedioAlumno(@PathVariable Long idAlumno) {
        Double promedioCalculado = notaService.calcularPromedioAlumno(idAlumno);
        return promedioCalculado != null ? ResponseEntity.ok(promedioCalculado) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Nota> guardarNota(@RequestBody Nota nuevaNota) {
        // Limpiar relaciones vacías
        if (nuevaNota.getAlumno() != null && nuevaNota.getAlumno().getId() == null) {
            nuevaNota.setAlumno(null);
        }
        if (nuevaNota.getAsignatura() != null && nuevaNota.getAsignatura().getId() == null) {
            nuevaNota.setAsignatura(null);
        }
        if (nuevaNota.getProfesor() != null && nuevaNota.getProfesor().getId() == null) {
            nuevaNota.setProfesor(null);
        }

        Nota notaGuardada = notaService.agregarNota(nuevaNota);
        return ResponseEntity.ok(notaGuardada);
    }

    @PatchMapping("/{idNota}/alumno")
    public ResponseEntity<Nota> asignarAlumnoANota(
            @PathVariable Long idNota,
            @RequestBody Map<String, Long> solicitud) {
        Long idAlumno = solicitud.get("alumnoId");
        Nota notaActualizada = notaService.asignarAlumnoANota(idNota, idAlumno);
        return ResponseEntity.ok(notaActualizada);
    }

    @PatchMapping("/{idNota}/asignatura")
    public ResponseEntity<Nota> asignarAsignaturaANota(
            @PathVariable Long idNota,
            @RequestBody Map<String, Long> solicitud) {
        Long idAsignatura = solicitud.get("asignaturaId");
        Nota notaActualizada = notaService.asignarAsignaturaANota(idNota, idAsignatura);
        return ResponseEntity.ok(notaActualizada);
    }

    @PatchMapping("/{idNota}/profesor")
    public ResponseEntity<Nota> asignarProfesorANota(
            @PathVariable Long idNota,
            @RequestBody Map<String, Long> solicitud) {
        Long idProfesor = solicitud.get("profesorId");
        Nota notaActualizada = notaService.asignarProfesorANota(idNota, idProfesor);
        return ResponseEntity.ok(notaActualizada);
    }

    @PutMapping("/{idNota}")
    public ResponseEntity<Nota> actualizarNota(@PathVariable Long idNota, @RequestBody Nota datosNota) {
        Nota notaActualizada = notaService.actualizarNota(idNota, datosNota);
        return ResponseEntity.ok(notaActualizada);
    }

    @DeleteMapping("/{idNota}")
    public ResponseEntity<Void> eliminarNota(@PathVariable Long idNota) {
        notaService.eliminarNota(idNota);
        return ResponseEntity.ok().build();
    }
}
