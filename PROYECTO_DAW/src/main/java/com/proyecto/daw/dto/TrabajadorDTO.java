package com.proyecto.daw.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class TrabajadorDTO {
	private Integer id;
	private String username;
	private String password;
	private String nomTrabajador;
	private String apeTrabajador;
	private String dni;
	private Date fecNacimiento;
	private String email;
	private String telefono;
	private Boolean activo;
}
