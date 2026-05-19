package com.proyecto.daw.model;

import java.sql.Date;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Solicitud {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id_solicitud;
	
	private Date fecha_registro;
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="id_adoptante")
	private Adoptante adoptante;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="id_mascota")
	private Mascota mascota;
	
	private String comentario;
	
	@Column(name="ruta_pdf_acta")
	private String acta_pdf;

	@Column(name = "ruta_pdf_firmado")
	private String rutaPdfFirmado;

	@Column(name = "fecha_acta")
	private LocalDateTime fechaActa;

	@Column(name = "estado_acta")
	private String estadoActa = "SIN_ACTA";
	
	@Column(name = "estado_solicitud")
	private String estado_solicitud;

	@Column(name = "fecha_creacion", insertable = false, updatable = false)
	private LocalDateTime fechaCreacion;

	@Column(name = "fecha_actualizacion", insertable = false, updatable = false)
	private LocalDateTime fechaActualizacion;

}

//CREATE TABLE solicitud (
//	    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
//	    fecha_registro DATE DEFAULT (CURRENT_DATE),
//	    id_adoptante INT NOT NULL, 
//	    id_mascota INT NOT NULL,
//	    comentario TEXT,
//	    ruta_pdf_acta VARCHAR(255), 
//	    estado_solicitud VARCHAR(20) DEFAULT 'PENDIENTE',
//	    CONSTRAINT chk_solicitud_estado CHECK (estado_solicitud IN ('PENDIENTE', 'APROBADA', 'RECHAZADA')),
//	    FOREIGN KEY (id_adoptante) REFERENCES adoptante(id_usuario),
//	    FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota)
//	);
