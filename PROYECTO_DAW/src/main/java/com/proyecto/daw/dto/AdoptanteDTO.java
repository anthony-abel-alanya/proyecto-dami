package com.proyecto.daw.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class AdoptanteDTO {
	private Integer id;
	private String username;
	private String nomAdoptante;
	private String apeAdoptante;
	private Date fecNacimiento;
	private String dni;
	private String email;
	private String telefono;
	private String direccion;
	private Boolean activo;
}
