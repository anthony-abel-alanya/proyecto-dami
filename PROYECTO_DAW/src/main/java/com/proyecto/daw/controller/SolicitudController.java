package com.proyecto.daw.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.proyecto.daw.dto.EstadoSolicitudDTO;
import com.proyecto.daw.dto.SolicitudDTO;
import com.proyecto.daw.exception.BadRequestException;
import com.proyecto.daw.model.ApiResponse;
import com.proyecto.daw.service.PdfService;
import com.proyecto.daw.service.SolicitudService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/solicitudes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SolicitudController {

	private final SolicitudService service;
	private final PdfService pdfService;

	@GetMapping
	public List<SolicitudDTO> listar(Authentication authentication) {
		return service.listarSolicitudes(authentication);
	}

	@GetMapping("/{id}")
	public SolicitudDTO buscarPorId(@PathVariable(name = "id") int idSolicitud) {
		return service.buscarDtoPorId(idSolicitud);
	}

	@PostMapping
	public ResponseEntity<SolicitudDTO> registrarSimple(@RequestBody Map<String, Object> body,
			Authentication authentication) {
		Integer idAdoptante = toIntegerOrNull(body.get("id_adoptante"), body.get("idAdoptante"));
		Integer idMascota = toInteger(body.get("id_mascota"), body.get("idMascota"));
		String comentario = body.get("comentario") != null ? body.get("comentario").toString() : null;
		return ResponseEntity.ok(service.registrarSolicitud(idAdoptante, idMascota, comentario, authentication));
	}

	@PutMapping("/{id}/estado")
	public SolicitudDTO cambiarEstado(@PathVariable Integer id, @RequestBody EstadoSolicitudDTO dto) {
		return service.cambiarEstado(id, dto.getEstado());
	}

	@PostMapping("/{id}/estado")
	public SolicitudDTO cambiarEstadoPost(@PathVariable Integer id, @RequestBody EstadoSolicitudDTO dto) {
		return service.cambiarEstado(id, dto.getEstado());
	}

	@GetMapping("/{id}/acta")
	public ResponseEntity<byte[]> generarActa(@PathVariable Integer id) throws Exception {
		byte[] pdf = pdfService.generarActaAdopcion(id);
		return ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_PDF)
				.header(HttpHeaders.CONTENT_DISPOSITION,
						ContentDisposition.attachment().filename("acta_solicitud_" + id + ".pdf").build().toString())
				.body(pdf);
	}

	@PostMapping("/{id}/acta-firmada")
	public SolicitudDTO subirActaFirmada(@PathVariable Integer id,
			@RequestParam("archivo") MultipartFile archivo) throws Exception {
		return service.guardarActaFirmada(id, archivo);
	}

	@PutMapping("/{id}/verificar-acta")
	public SolicitudDTO verificarActa(@PathVariable Integer id) {
		return service.verificarActa(id);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> eliminar(@PathVariable(name = "id") int idSolicitud) {
		service.eliminarLogico(idSolicitud);
		return ResponseEntity.ok(new ApiResponse("Solicitud rechazada y movida al historial correctamente"));
	}

	private Integer toInteger(Object first, Object second) {
		Integer value = toIntegerOrNull(first, second);
		if (value == null) {
			throw new BadRequestException("Falta un identificador requerido");
		}
		return value;
	}

	private Integer toIntegerOrNull(Object first, Object second) {
		Object value = first != null ? first : second;
		if (value == null) {
			return null;
		}
		if (value instanceof Number number) {
			return number.intValue();
		}
		return Integer.valueOf(value.toString());
	}
}
