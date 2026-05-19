package com.proyecto.daw.dto;

import lombok.Data;

@Data
public class PerfilDTO {
	private Integer id;
	private String username;
	private String rol;
	private String nombres;
	private String apellidos;
	private String dni;
	private String email;
	private String telefono;
	private String direccion;
}
