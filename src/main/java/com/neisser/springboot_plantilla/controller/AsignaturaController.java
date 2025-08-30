package com.neisser.springboot_plantilla.controller;

import com.neisser.springboot_plantilla.entity.Asignatura;
import com.neisser.springboot_plantilla.service.AsignaturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/asignaturas")
public class AsignaturaController {

    @Autowired
    private AsignaturaService asignaturaService;


    @GetMapping
    public ResponseEntity<List<Asignatura>> listarAsignaturas() {
        List<Asignatura> listaAsignaturas = asignaturaService.listarTodasLasAsignaturas();
        return ResponseEntity.ok(listaAsignaturas);
    }


    @GetMapping("/{idAsignatura}")
    public ResponseEntity<Asignatura> obtenerAsignatura(@PathVariable Long idAsignatura) {
        return asignaturaService.obtenerAsignaturaPorId(idAsignatura)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/carrera/{idCarrera}")
    public ResponseEntity<List<Asignatura>> obtenerAsignaturasPorCarrera(@PathVariable Long idCarrera) {
        List<Asignatura> listaAsignaturas = asignaturaService.obtenerAsignaturasPorCarrera(idCarrera);
        return ResponseEntity.ok(listaAsignaturas);
    }

    @PostMapping
    public ResponseEntity<Asignatura> guardarAsignatura(@RequestBody Asignatura nuevaAsignatura) {
        if (nuevaAsignatura.getCarrera() != null && nuevaAsignatura.getCarrera().getId() == null) {
            nuevaAsignatura.setCarrera(null);
        }
        Asignatura asignaturaGuardada = asignaturaService.agregarAsignatura(nuevaAsignatura);
        return ResponseEntity.ok(asignaturaGuardada);
    }

    @PatchMapping("/{idAsignatura}/carrera")
    public ResponseEntity<Asignatura> asignarCarreraAAsignatura(
            @PathVariable Long idAsignatura,
            @RequestBody Map<String, Long> solicitud) {
        Long idCarrera = solicitud.get("carreraId");
        Asignatura asignaturaActualizada = asignaturaService.asignarCarreraAAsignatura(idAsignatura, idCarrera);
        return ResponseEntity.ok(asignaturaActualizada);
    }


    @PutMapping("/{idAsignatura}")
    public ResponseEntity<Asignatura> actualizarAsignatura(@PathVariable Long idAsignatura, @RequestBody Asignatura datosAsignatura) {
        Asignatura asignaturaActualizada = asignaturaService.actualizarAsignatura(idAsignatura, datosAsignatura);
        return ResponseEntity.ok(asignaturaActualizada);
    }


    @DeleteMapping("/{idAsignatura}")
    public ResponseEntity<Void> eliminarAsignatura(@PathVariable Long idAsignatura) {
        asignaturaService.eliminarAsignatura(idAsignatura);
        return ResponseEntity.ok().build();
    }
}