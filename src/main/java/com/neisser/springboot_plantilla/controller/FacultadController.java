package com.neisser.springboot_plantilla.controller;

import com.neisser.springboot_plantilla.entity.Facultad;
import com.neisser.springboot_plantilla.service.FacultadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/facultades")
public class FacultadController {

    @Autowired
    private FacultadService facultadService;

    @GetMapping
    public ResponseEntity<List<Facultad>> listarFacultades() {
        List<Facultad> listaFacultades = facultadService.listarTodasLasFacultades();
        return ResponseEntity.ok(listaFacultades);
    }

    @GetMapping("/{idFacultad}")
    public ResponseEntity<Facultad> obtenerFacultad(@PathVariable Long idFacultad) {
        return facultadService.obtenerFacultadPorId(idFacultad)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Facultad> guardarFacultad(@RequestBody Facultad nuevaFacultad) {
        Facultad facultadGuardada = facultadService.agregarFacultad(nuevaFacultad);
        return ResponseEntity.ok(facultadGuardada);
    }

    @PutMapping("/{idFacultad}")
    public ResponseEntity<Facultad> actualizarFacultad(@PathVariable Long idFacultad, @RequestBody Facultad datosFacultad) {
        Facultad facultadActualizada = facultadService.actualizarFacultad(idFacultad, datosFacultad);
        return ResponseEntity.ok(facultadActualizada);
    }

    @DeleteMapping("/{idFacultad}")
    public ResponseEntity<Void> eliminarFacultad(@PathVariable Long idFacultad) {
        facultadService.eliminarFacultad(idFacultad);
        return ResponseEntity.ok().build();
    }
}
