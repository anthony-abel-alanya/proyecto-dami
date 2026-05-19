package com.proyecto.daw.dto;

import lombok.Data;

@Data
public class ActualizarPerfilDTO {
	private String nombres;
	private String apellidos;
	private String email;
	private String telefono;
	private String direccion;
}
