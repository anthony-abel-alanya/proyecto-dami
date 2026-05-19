package com.proyecto.daw.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.proyecto.daw.dto.SolicitudDTO;
import com.proyecto.daw.exception.BadRequestException;
import com.proyecto.daw.exception.NotFoundException;
import com.proyecto.daw.model.Adoptante;
import com.proyecto.daw.model.Mascota;
import com.proyecto.daw.model.Solicitud;
import com.proyecto.daw.model.Usuario;
import com.proyecto.daw.repository.AdoptanteRepository;
import com.proyecto.daw.repository.MascotaRepository;
import com.proyecto.daw.repository.SolicitudRepository;
import com.proyecto.daw.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SolicitudService {

	private final SolicitudRepository solicitudRepo;
	private final AdoptanteRepository adoptanteRepo;
	private final MascotaRepository mascotaRepo;
	private final UsuarioRepository usuarioRepo;

	@Value("${app.upload.dir:uploads/}")
	private String uploadDir;

	public List<SolicitudDTO> listarSolicitudes(Authentication authentication) {
		Usuario usuario = usuarioRepo.findByUsername(authentication.getName())
				.orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
		if ("ROLE_ADOPTANTE".equals(usuario.getRol())) {
			return solicitudRepo.listarPorAdoptante(usuario.getId_usuario()).stream().map(this::toDto).toList();
		}
		return solicitudRepo.listarSolicitudes().stream().map(this::toDto).toList();
	}

	private Solicitud guardarNuevaSolicitud(Integer idAdoptante, Integer idMascota, String comentario) {
		Adoptante adoptante = adoptanteRepo.findById(idAdoptante)
				.orElseThrow(() -> new NotFoundException("Adoptante no encontrado"));
		Mascota mascota = mascotaRepo.findById(idMascota)
				.orElseThrow(() -> new NotFoundException("Mascota no encontrada"));
		validarNuevaSolicitud(adoptante.getId_usuario(), mascota);

		Solicitud s = new Solicitud();
		s.setAdoptante(adoptante);
		s.setMascota(mascota);
		s.setComentario(comentario);
		s.setEstado_solicitud("PENDIENTE");
		s.setEstadoActa("SIN_ACTA");
		s.setFecha_registro(new Date(System.currentTimeMillis()));
		return solicitudRepo.save(s);
	}

	public SolicitudDTO registrarSolicitud(Integer idAdoptante, Integer idMascota, String comentario) {
		return registrarSolicitud(idAdoptante, idMascota, comentario, null);
	}

	public SolicitudDTO registrarSolicitud(Integer idAdoptante, Integer idMascota, String comentario,
			Authentication authentication) {
		try {
			Integer adoptanteId = idAdoptante != null ? idAdoptante : idAdoptanteAutenticado(authentication);
			return toDto(guardarNuevaSolicitud(adoptanteId, idMascota, comentario));
		} catch (Exception e) {
			throw new BadRequestException(e.getMessage());
		}
	}

	public Solicitud buscarPorId(Integer idSolicitud) {
		return solicitudRepo.findById(idSolicitud).orElse(null);
	}

	public SolicitudDTO buscarDtoPorId(Integer idSolicitud) {
		return toDto(solicitudRepo.buscarDetallePorId(idSolicitud)
				.orElseThrow(() -> new NotFoundException("Solicitud no encontrada")));
	}

	@Transactional
	public SolicitudDTO cambiarEstado(Integer id, String nuevoEstado) {
		Solicitud solicitud = solicitudRepo.buscarDetallePorId(id)
				.orElseThrow(() -> new NotFoundException("Solicitud no encontrada"));
		String estadoActual = solicitud.getEstado_solicitud();
		if (!transicionValida(estadoActual, nuevoEstado)) {
			throw new BadRequestException("Transicion no permitida: " + estadoActual + " -> " + nuevoEstado);
		}
		solicitud.setEstado_solicitud(nuevoEstado);
		if ("RECHAZADA".equals(nuevoEstado) && solicitud.getMascota() != null) {
			solicitud.getMascota().setEst_adopcion("DISPONIBLE");
		}
		return toDto(solicitudRepo.save(solicitud));
	}

	@Transactional
	public SolicitudDTO guardarActaFirmada(Integer id, MultipartFile archivo) throws Exception {
		if (archivo == null || archivo.isEmpty()) {
			throw new BadRequestException("Debe adjuntar el archivo firmado");
		}
		Solicitud solicitud = solicitudRepo.buscarDetallePorId(id)
				.orElseThrow(() -> new NotFoundException("Solicitud no encontrada"));
		Path dir = Path.of(uploadDir, "actas-firmadas");
		Files.createDirectories(dir);
		String extension = archivo.getOriginalFilename() != null && archivo.getOriginalFilename().contains(".")
				? archivo.getOriginalFilename().substring(archivo.getOriginalFilename().lastIndexOf('.'))
				: ".pdf";
		String nombreFinal = "acta_firmada_solicitud_" + id + "_" + System.currentTimeMillis() + extension;
		archivo.transferTo(dir.resolve(nombreFinal));
		solicitud.setRutaPdfFirmado("actas-firmadas/" + nombreFinal);
		solicitud.setEstadoActa("FIRMADA");
		return toDto(solicitudRepo.save(solicitud));
	}

	@Transactional
	public SolicitudDTO verificarActa(Integer id) {
		Solicitud solicitud = solicitudRepo.buscarDetallePorId(id)
				.orElseThrow(() -> new NotFoundException("Solicitud no encontrada"));
		if (!"FIRMADA".equals(solicitud.getEstadoActa())) {
			throw new BadRequestException("El acta solo puede verificarse despues de ser firmada");
		}
		solicitud.setEstadoActa("VERIFICADA");
		solicitud.setEstado_solicitud("APROBADA");
		solicitud.getMascota().setEst_adopcion("ADOPTADO");
		mascotaRepo.save(solicitud.getMascota());
		return toDto(solicitudRepo.save(solicitud));
	}

	public void eliminarLogico(int id) {
		Solicitud solicitud = solicitudRepo.findById(id).orElse(null);
		if (solicitud != null) {
			solicitud.setEstado_solicitud("RECHAZADA");
			if (solicitud.getMascota() != null) {
				solicitud.getMascota().setEst_adopcion("DISPONIBLE");
			}
			solicitudRepo.save(solicitud);
		}
	}

	public SolicitudDTO toDto(Solicitud solicitud) {
		SolicitudDTO dto = new SolicitudDTO();
		dto.setIdSolicitud(solicitud.getId_solicitud());
		dto.setFechaRegistro(solicitud.getFecha_registro());
		dto.setComentario(solicitud.getComentario());
		dto.setRutaPdfActa(solicitud.getActa_pdf());
		dto.setRutaPdfFirmado(solicitud.getRutaPdfFirmado());
		dto.setFechaActa(solicitud.getFechaActa());
		dto.setEstadoActa(solicitud.getEstadoActa());
		dto.setEstadoSolicitud(solicitud.getEstado_solicitud());
		if (solicitud.getAdoptante() != null) {
			Adoptante a = solicitud.getAdoptante();
			dto.setIdAdoptante(a.getId_usuario());
			dto.setAdoptanteNombre((a.getNom_adoptante() + " " + a.getApe_adoptante()).trim());
			dto.setAdoptanteDni(a.getDni());
		}
		if (solicitud.getMascota() != null) {
			dto.setIdMascota(solicitud.getMascota().getId_mascota());
			dto.setMascotaNombre(solicitud.getMascota().getNombre());
		}
		return dto;
	}

	private boolean transicionValida(String actual, String nuevo) {
		return ("PENDIENTE".equals(actual) && "EN_PROCESO".equals(nuevo))
				|| ("EN_PROCESO".equals(actual) && ("APROBADA".equals(nuevo) || "RECHAZADA".equals(nuevo)));
	}

	private Integer idAdoptanteAutenticado(Authentication authentication) {
		if (authentication == null) {
			throw new BadRequestException("No se pudo identificar al adoptante autenticado");
		}
		Usuario usuario = usuarioRepo.findByUsername(authentication.getName())
				.orElseThrow(() -> new NotFoundException("Usuario autenticado no encontrado"));
		if (!"ROLE_ADOPTANTE".equals(usuario.getRol())) {
			throw new BadRequestException("Solo un adoptante puede registrar una solicitud");
		}
		return usuario.getId_usuario();
	}

	private void validarNuevaSolicitud(Integer idAdoptante, Mascota mascota) {
		if (!"DISPONIBLE".equals(mascota.getEst_adopcion())) {
			throw new BadRequestException("Solo se puede solicitar una mascota disponible");
		}
		if ("CRITICO".equals(mascota.getEst_salud())) {
			throw new BadRequestException("Una mascota en estado critico no puede ser adoptada");
		}
		boolean yaTieneSolicitudActiva = solicitudRepo.listarPorAdoptante(idAdoptante).stream()
				.anyMatch(s -> s.getMascota() != null
						&& mascota.getId_mascota().equals(s.getMascota().getId_mascota())
						&& ("PENDIENTE".equals(s.getEstado_solicitud())
								|| "EN_PROCESO".equals(s.getEstado_solicitud())));
		if (yaTieneSolicitudActiva) {
			throw new BadRequestException("Ya existe una solicitud activa para esta mascota");
		}
	}
}
