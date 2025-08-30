package com.neisser.springboot_plantilla.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "nota")
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nota_id")
    private Long id;

    @Column(name = "valor")
    private int valor;

    @Enumerated(EnumType.STRING)
    private Tipo tipo;

    @Column(name = "fecha")
    private Date fecha;


        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "alumno_id")
        @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "notas"})
        private Alumno alumno;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "asignatura_id")
        @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "notas"})
        private Asignatura asignatura;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "profesor_id")
        @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "notas"})
        private Profesor profesor;


    public enum Tipo {
        SISTEMATICA,
        PARCIAL,
        FINAL
    }

    public Nota() {
    }

    public Nota(final Long id, final int valor, final Tipo tipo, final Date fecha, final Alumno alumno, final Asignatura asignatura, final Profesor profesor) {
        this.id = id;
        this.valor = valor;
        this.tipo = tipo;
        this.fecha = fecha;
        this.alumno = alumno;
        this.asignatura = asignatura;
        this.profesor = profesor;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public int getValor() {
        return this.valor;
    }

    public void setValor(final int valor) {
        this.valor = valor;
    }

    public Tipo getTipo() {
        return this.tipo;
    }

    public void setTipo(final Tipo tipo) {
        this.tipo = tipo;
    }

    public Date getFecha() {
        return this.fecha;
    }

    public void setFecha(final Date fecha) {
        this.fecha = fecha;
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

    public Profesor getProfesor() {
        return this.profesor;
    }

    public void setProfesor(final Profesor profesor) {
        this.profesor = profesor;
    }
}