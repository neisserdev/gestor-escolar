package com.neisser.springboot_plantilla.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "asistencia")
public class Asistencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asistencia_id")
    private Long id;

    @Column(name = "fecha")
    private Date fechaAsistencia;

    @Column(name = "presente")
    private Boolean presente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alumno_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "asistencias"})
    private Alumno alumno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asignatura_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "asistencias"})
    private Asignatura asignatura;

    public Asistencia() {
    }

    public Asistencia(final Long id, final Date fechaAsistencia, final Boolean presente, final Alumno alumno, final Asignatura asignatura) {
        this.id = id;
        this.fechaAsistencia = fechaAsistencia;
        this.presente = presente;
        this.alumno = alumno;
        this.asignatura = asignatura;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public Date getFechaAsistencia() {
        return this.fechaAsistencia;
    }

    public void setFechaAsistencia(final Date fechaAsistencia) {
        this.fechaAsistencia = fechaAsistencia;
    }

    public Boolean getPresente() {
        return this.presente;
    }

    public void setPresente(final Boolean presente) {
        this.presente = presente;
    }

    public Alumno getAlumno() {
        return this.alumno;
    }

    public void setAlumno(final Alumno alumno) {
        this.alumno = alumno;
    }

    public Asignatura getAsignatura() {
        return this.asignatura;
    }

    public void setAsignatura(final Asignatura asignatura) {
        this.asignatura = asignatura;
    }
}