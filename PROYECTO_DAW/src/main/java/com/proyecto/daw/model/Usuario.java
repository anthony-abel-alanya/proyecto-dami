package com.proyecto.daw.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED) // Fundamental para herencia de tablas
public class Usuario {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id_usuario;
	
	@Column(unique = true, nullable = false)
	private String username;
	
	@Column(nullable = false)
	@JsonIgnore
	private String password;
	
	private String rol; // 'ROLE_ADMIN', 'ROLE_TRABAJADOR', 'ROLE_ADOPTANTE'

	private Boolean activo = true;

	@Column(name = "fecha_creacion", insertable = false, updatable = false)
	private LocalDateTime fechaCreacion;
}
