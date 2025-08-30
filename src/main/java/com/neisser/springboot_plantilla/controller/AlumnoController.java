package com.neisser.springboot_plantilla.controller;

import com.neisser.springboot_plantilla.entity.Alumno;
import com.neisser.springboot_plantilla.service.AlumnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/alumnos")
public class AlumnoController {

    @Autowired
    private AlumnoService alumnoService;

    @GetMapping
    public ResponseEntity<List<Alumno>> listarAlumnos() {
        List<Alumno> listaAlumnos = alumnoService.listarTodosLosAlumnos();
        return ResponseEntity.ok(listaAlumnos);
    }


    @GetMapping("/{idAlumno}")
    public ResponseEntity<Alumno> obtenerAlumno(@PathVariable Long idAlumno) {
        return alumnoService.obtenerAlumnoPorId(idAlumno)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/carrera/{idCarrera}")
    public ResponseEntity<List<Alumno>> obtenerAlumnosPorCarrera(@PathVariable Long idCarrera) {
        List<Alumno> listaAlumnos = alumnoService.obtenerAlumnosPorCarrera(idCarrera);
        return ResponseEntity.ok(listaAlumnos);
    }


    @PostMapping
    public ResponseEntity<Alumno> guardarAlumno(@RequestBody Alumno nuevoAlumno) {
        if (nuevoAlumno.getCarrera() != null && nuevoAlumno.getCarrera().getId() == null) {
            nuevoAlumno.setCarrera(null);
        }
        Alumno alumnoGuardado = alumnoService.agregarAlumno(nuevoAlumno);
        return ResponseEntity.ok(alumnoGuardado);
    }


    @PatchMapping("/{idAlumno}/carrera")
    public ResponseEntity<Alumno> asignarCarreraAAlumno(
            @PathVariable Long idAlumno,
            @RequestBody Map<String, Long> solicitud) {
        Long idCarrera = solicitud.get("carreraId");
        Alumno alumnoActualizado = alumnoService.asignarCarreraAAlumno(idAlumno, idCarrera);
        return ResponseEntity.ok(alumnoActualizado);
    }


    @PutMapping("/{idAlumno}")
    public ResponseEntity<Alumno> actualizarAlumno(@PathVariable Long idAlumno, @RequestBody Alumno datosAlumno) {
        Alumno alumnoActualizado = alumnoService.actualizarAlumno(idAlumno, datosAlumno);
        return ResponseEntity.ok(alumnoActualizado);
    }


    @DeleteMapping("/{idAlumno}")
    public ResponseEntity<Void> eliminarAlumno(@PathVariable Long idAlumno) {
        alumnoService.eliminarAlumno(idAlumno);
        return ResponseEntity.ok().build();
    }
}
