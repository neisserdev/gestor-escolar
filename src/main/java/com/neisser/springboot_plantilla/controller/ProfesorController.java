package com.neisser.springboot_plantilla.controller;

import com.neisser.springboot_plantilla.entity.Profesor;
import com.neisser.springboot_plantilla.service.ProfesorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profesores")
public class ProfesorController {

    @Autowired
    private ProfesorService profesorService;

    @GetMapping
    public ResponseEntity<List<Profesor>> listarProfesores() {
        List<Profesor> listaProfesores = profesorService.listarTodosLosProfesores();
        return ResponseEntity.ok(listaProfesores);
    }

    @GetMapping("/{idProfesor}")
    public ResponseEntity<Profesor> obtenerProfesor(@PathVariable Long idProfesor) {
        return profesorService.obtenerProfesorPorId(idProfesor)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Profesor> guardarProfesor(@RequestBody Profesor nuevoProfesor) {
        Profesor profesorGuardado = profesorService.agregarProfesor(nuevoProfesor);
        return ResponseEntity.ok(profesorGuardado);
    }

    @PutMapping("/{idProfesor}")
    public ResponseEntity<Profesor> actualizarProfesor(@PathVariable Long idProfesor, @RequestBody Profesor datosProfesor) {
        Profesor profesorActualizado = profesorService.actualizarProfesor(idProfesor, datosProfesor);
        return ResponseEntity.ok(profesorActualizado);
    }

    @DeleteMapping("/{idProfesor}")
    public ResponseEntity<Void> eliminarProfesor(@PathVariable Long idProfesor) {
        profesorService.eliminarProfesor(idProfesor);
        return ResponseEntity.ok().build();
    }
}
