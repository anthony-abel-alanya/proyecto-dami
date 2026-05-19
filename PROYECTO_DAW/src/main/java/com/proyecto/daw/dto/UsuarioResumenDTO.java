package com.proyecto.daw.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioResumenDTO {
	private Integer id;
	private String username;
	private String rol;
	private Boolean activo;
	private LocalDateTime fechaCreacion;
	private String nombreCompleto;
}
