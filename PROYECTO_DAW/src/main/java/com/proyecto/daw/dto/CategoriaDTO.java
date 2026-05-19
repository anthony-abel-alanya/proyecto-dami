package com.proyecto.daw.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaDTO {
	private Integer id;
	private String nombre;
	private String descripcion;
	private Long cantidadMascotas;
}
