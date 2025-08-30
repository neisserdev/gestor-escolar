package com.neisser.springboot_plantilla.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "facultad")
public class Facultad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "facultad_id")
    private Long id;

    @Column(name = "nombre_facultad")
    private String nombreFacultad;

    @JsonIgnore
    @OneToMany(mappedBy = "facultad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Carrera> carreras;

    public Facultad() {
    }

    public Facultad(final Long id, final String nombreFacultad) {
        this.id = id;
        this.nombreFacultad = nombreFacultad;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getNombreFacultad() {
        return this.nombreFacultad;
    }

    public void setNombreFacultad(final String nombreFacultad) {
        this.nombreFacultad = nombreFacultad;
    }

    public List<Carrera> getCarreras() {
        return this.carreras;
    }

    public void setCarreras(final List<Carrera> carreras) {
        this.carreras = carreras;
    }
}