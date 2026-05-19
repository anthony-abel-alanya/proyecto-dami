package com.proyecto.daw.model;

import java.sql.Date;

import lombok.Data;

@Data
public class RegistroAdoptanteRequest {

	private String username;
	private String password;
	private String nom_adoptante;
	private String ape_adoptante;
	private Date fec_nacimiento;
	private String dni;
	private String email;
	private String telefono;
	private String direccion;
}
