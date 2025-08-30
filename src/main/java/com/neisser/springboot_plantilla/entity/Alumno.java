package com.neisser.springboot_plantilla.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "alumno")
public class Alumno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alumno_id")
    private Long id;

    @Column(name = "nombre_completo")
    private String nombreCompleto;

    @Column(name = "fecha_nacimiento")
    private Date fechaNacimiento;

    @Column(name = "correo")
    private String correo;

    @JsonIgnore
    @OneToMany(mappedBy = "alumno", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Nota> notas;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "alumnos"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carrera_id", nullable = true)
    private Carrera carrera;

    @JsonIgnore
    @OneToMany(mappedBy = "alumno", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Asistencia> asistencias;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "alumno_asignatura",
            joinColumns = @JoinColumn(name = "alumno_id"),
            inverseJoinColumns = @JoinColumn(name = "asignatura_id")
    )
    private List<Asignatura> asignaturas;

    public Alumno() {
    }

    public Alumno(final Long id, final String nombreCompleto, final Date fechaNacimiento, final String correo) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.fechaNacimiento = fechaNacimiento;
        this.correo = correo;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getNombreCompleto() {
        return this.nombreCompleto;
    }

    public void setNombreCompleto(final String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public Date getFechaNacimiento() {
        return this.fechaNacimiento;
    }

    public void setFechaNacimiento(final Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getCorreo() {
        return this.correo;
    }

    public void setCorreo(final String correo) {
        this.correo = correo;
    }

    public List<Nota> getNotas() {
        return this.notas;
    }

    public void setNotas(final List<Nota> notas) {
        this.notas = notas;
    }

    public Carrera getCarrera() {
        return this.carrera;
    }

    public void setCarrera(final Carrera carrera) {
        this.carrera = carrera;
    }

    public List<Asistencia> getAsistencias() {
        return this.asistencias;
    }

    public void setAsistencias(final List<Asistencia> asistencias) {
        this.asistencias = asistencias;
    }

    public List<Asignatura> getAsignaturas() {
        return this.asignaturas;
    }

    public void setAsignaturas(final List<Asignatura> asignaturas) {
        this.asignaturas = asignaturas;
    }
}