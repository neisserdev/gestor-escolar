package com.neisser.springboot_plantilla.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "carrera")
public class Carrera {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "carrera_id")
    private Long id;

    @Column(name = "nombre_carrera")
    private String nombreCarrera;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "carreras"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facultad_id")
    private Facultad facultad;

    @JsonIgnore
    @OneToMany(mappedBy = "carrera", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Alumno> alumnos;

    @JsonIgnore
    @OneToMany(mappedBy = "carrera", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Asignatura> asignaturas;

    @JsonIgnore
    @OneToMany(mappedBy = "carrera", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Profesor> profesores;

    public Carrera() {
    }

    public Carrera(final Long id, final String nombreCarrera, final Facultad facultad) {
        this.id = id;
        this.nombreCarrera = nombreCarrera;
        this.facultad = facultad;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getNombreCarrera() {
        return this.nombreCarrera;
    }

    public void setNombreCarrera(final String nombreCarrera) {
        this.nombreCarrera = nombreCarrera;
    }

    public Facultad getFacultad() {
        return this.facultad;
    }

    public void setFacultad(final Facultad facultad) {
        this.facultad = facultad;
    }

    public List<Alumno> getAlumnos() {
        return this.alumnos;
    }

    public void setAlumnos(final List<Alumno> alumnos) {
        this.alumnos = alumnos;
    }

    public List<Asignatura> getAsignaturas() {
        return this.asignaturas;
    }

    public void setAsignaturas(final List<Asignatura> asignaturas) {
        this.asignaturas = asignaturas;
    }

    public List<Profesor> getProfesores() {
        return this.profesores;
    }

    public void setProfesores(final List<Profesor> profesores) {
        this.profesores = profesores;
    }
}

