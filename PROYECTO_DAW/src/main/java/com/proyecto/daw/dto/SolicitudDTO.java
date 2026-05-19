package com.proyecto.daw.dto;

import java.sql.Date;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class SolicitudDTO {
	private Integer idSolicitud;
	private Date fechaRegistro;
	private Integer idAdoptante;
	private String adoptanteNombre;
	private String adoptanteDni;
	private Integer idMascota;
	private String mascotaNombre;
	private String comentario;
	private String rutaPdfActa;
	private String rutaPdfFirmado;
	private LocalDateTime fechaActa;
	private String estadoActa;
	private String estadoSolicitud;
}
