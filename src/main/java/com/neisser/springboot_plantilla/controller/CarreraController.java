package com.neisser.springboot_plantilla.controller;

import com.neisser.springboot_plantilla.entity.Carrera;
import com.neisser.springboot_plantilla.service.CarreraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/carreras")
public class CarreraController {

    @Autowired
    private CarreraService carreraService;

    @GetMapping
    public ResponseEntity<List<Carrera>> listarCarreras() {
        List<Carrera> listaCarreras = carreraService.listarTodasLasCarreras();
        return ResponseEntity.ok(listaCarreras);
    }

    @GetMapping("/{idCarrera}")
    public ResponseEntity<Carrera> obtenerCarrera(@PathVariable Long idCarrera) {
        return carreraService.obtenerCarreraPorId(idCarrera)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/facultad/{idFacultad}")
    public ResponseEntity<List<Carrera>> obtenerCarrerasPorFacultad(@PathVariable Long idFacultad) {
        List<Carrera> listaCarreras = carreraService.obtenerCarrerasPorFacultad(idFacultad);
        return ResponseEntity.ok(listaCarreras);
    }

    @PostMapping
    public ResponseEntity<Carrera> guardarCarrera(@RequestBody Carrera nuevaCarrera) {
        if (nuevaCarrera.getFacultad() != null && nuevaCarrera.getFacultad().getId() == null) {
            nuevaCarrera.setFacultad(null);
        }
        Carrera carreraGuardada = carreraService.agregarCarrera(nuevaCarrera);
        return ResponseEntity.ok(carreraGuardada);
    }

    @PatchMapping("/{idCarrera}/facultad")
    public ResponseEntity<Carrera> asignarFacultadACarrera(
            @PathVariable Long idCarrera,
            @RequestBody Map<String, Long> solicitud) {

        System.out.println("🔵 CONTROLADOR - Request recibido");
        System.out.println("🔵 ID Carrera: " + idCarrera);
        System.out.println("🔵 Solicitud completa: " + solicitud);

        Long idFacultad = solicitud.get("facultadId");
        System.out.println("🔵 ID Facultad extraído: " + idFacultad);

        Carrera carreraActualizada = carreraService.asignarFacultadACarrera(idCarrera, idFacultad);

        System.out.println("🔵 CONTROLADOR - Respuesta: " + carreraActualizada);

        return ResponseEntity.ok(carreraActualizada);
    }


    @PutMapping("/{idCarrera}")
    public ResponseEntity<Carrera> actualizarCarrera(@PathVariable Long idCarrera, @RequestBody Carrera datosCarrera) {
        Carrera carreraActualizada = carreraService.actualizarCarrera(idCarrera, datosCarrera);
        return ResponseEntity.ok(carreraActualizada);
    }


    @DeleteMapping("/{idCarrera}")
    public ResponseEntity<Void> eliminarCarrera(@PathVariable Long idCarrera) {
        carreraService.eliminarCarrera(idCarrera);
        return ResponseEntity.ok().build();
    }
}
