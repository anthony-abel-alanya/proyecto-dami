package com.proyecto.daw.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Mascota {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id_mascota;
	
	private String nombre;
	
	private String especie;
	
	private String raza;
	
	private Integer edad_anios;
	
	private Integer edad_meses;

	@Column(columnDefinition = "TEXT")
	private String descripcion;
	
	@Column(name = "estado_salud")
    private String est_salud;
    
    @Column(name = "estado_adopcion")
    private String est_adopcion;
    
	private String ruta_imagen;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_categoria")
	private Categoria categoria;

	@Column(name = "fecha_creacion", insertable = false, updatable = false)
	private LocalDateTime fechaCreacion;

	@Column(name = "fecha_actualizacion", insertable = false, updatable = false)
	private LocalDateTime fechaActualizacion;
}

