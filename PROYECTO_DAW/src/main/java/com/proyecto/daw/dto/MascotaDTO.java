package com.proyecto.daw.dto;

import lombok.Data;

@Data
public class MascotaDTO {
	private Integer idMascota;
	private String nombre;
	private String especie;
	private String raza;
	private Integer edadAnios;
	private Integer edadMeses;
	private String descripcion;
	private String estadoSalud;
	private String estadoAdopcion;
	private String rutaImagen;
	private Integer categoriaId;
	private String categoriaNombre;
}
