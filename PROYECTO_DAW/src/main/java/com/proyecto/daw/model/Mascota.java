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

//CREATE TABLE mascota (
//	    id_mascota INT AUTO_INCREMENT PRIMARY KEY,
//	    nombre VARCHAR(50) NOT NULL,
//	    especie VARCHAR(20) NOT NULL, 
//	    raza VARCHAR(50) NOT NULL,
//	    -- Dividimos la edad para mayor precisión
//	    edad_anios INT DEFAULT 0,
//	    edad_meses INT DEFAULT 0,
//	    estado_salud VARCHAR(50) NOT NULL,
//	    estado_adopcion VARCHAR(20) DEFAULT 'DISPONIBLE',
//	    ruta_imagen VARCHAR(255), 
//	    
//	    -- Validamos que no pongan edades negativas
//	    CONSTRAINT chk_edad_anios CHECK (edad_anios >= 0),
//	    CONSTRAINT chk_edad_meses CHECK (edad_meses >= 0 AND edad_meses < 12),
//	    
//	    CONSTRAINT chk_mascota_salud CHECK (estado_salud IN ('SIN NOVEDADES', 'EN TRATAMIENTO', 'CRITICO')),
//	    CONSTRAINT chk_mascota_adopcion CHECK (estado_adopcion IN ('DISPONIBLE', 'ADOPTADO', 'RESERVADO'))
//	);
