package com.neisser.springboot_plantilla.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "asignatura")
public class Asignatura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asignatura_id")
    private Long id;

    @Column(name = "nombre_asignatura")
    private String nombreAsignatura;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "asignaturas"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carrera_id")
    private Carrera carrera;

    @JsonIgnore
    @OneToMany(mappedBy = "asignatura", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Nota> notas;

    @JsonIgnore
    @OneToMany(mappedBy = "asignatura", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Asistencia> asistencias;

    @JsonIgnore
    @ManyToMany(mappedBy = "asignaturas", fetch = FetchType.LAZY)
    private List<Alumno> alumnos;

    @JsonIgnore
    @ManyToMany(mappedBy = "asignaturas", fetch = FetchType.LAZY)
    private List<Profesor> profesores;

    public Asignatura() {
    }

    public Asignatura(final Long id, final String nombreAsignatura, final Carrera carrera) {
        this.id = id;
        this.nombreAsignatura = nombreAsignatura;
        this.carrera = carrera;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getNombreAsignatura() {
        return this.nombreAsignatura;
    }

    public void setNombreAsignatura(final String nombreAsignatura) {
        this.nombreAsignatura = nombreAsignatura;
    }

    public Carrera getCarrera() {
        return this.carrera;
    }

    public void setCarrera(final Carrera carrera) {
        this.carrera = carrera;
    }

    public List<Nota> getNotas() {
        return this.notas;
    }

    public void setNotas(final List<Nota> notas) {
        this.notas = notas;
    }

    public List<Asistencia> getAsistencias() {
        return this.asistencias;
    }

    public void setAsistencias(final List<Asistencia> asistencias) {
        this.asistencias = asistencias;
    }

    public List<Alumno> getAlumnos() {
        return this.alumnos;
    }

    public void setAlumnos(final List<Alumno> alumnos) {
        this.alumnos = alumnos;
    }

    public List<Profesor> getProfesores() {
        return this.profesores;
    }

    public void setProfesores(final List<Profesor> profesores) {
        this.profesores = profesores;
    }
}
