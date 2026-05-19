package com.proyecto.daw.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.proyecto.daw.dto.ActualizarPerfilDTO;
import com.proyecto.daw.dto.AdoptanteDTO;
import com.proyecto.daw.dto.PerfilDTO;
import com.proyecto.daw.dto.TrabajadorDTO;
import com.proyecto.daw.dto.UsuarioResumenDTO;
import com.proyecto.daw.exception.BadRequestException;
import com.proyecto.daw.exception.ConflictException;
import com.proyecto.daw.exception.NotFoundException;
import com.proyecto.daw.model.Adoptante;
import com.proyecto.daw.model.Trabajador;
import com.proyecto.daw.model.Usuario;
import com.proyecto.daw.repository.AdoptanteRepository;
import com.proyecto.daw.repository.TrabajadorRepository;
import com.proyecto.daw.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

	private final UsuarioRepository usuarioRepository;
	private final AdoptanteRepository adoptanteRepository;
	private final TrabajadorRepository trabajadorRepository;
	private final PasswordEncoder passwordEncoder;

	public Usuario findByUsername(String username) {
		return usuarioRepository.findByUsername(username).orElse(null);
	}

	public Usuario guardar(Usuario usuario) {
		return usuarioRepository.save(usuario);
	}

	public boolean existeUsername(String username) {
		return usuarioRepository.existsByUsername(username);
	}

	public List<UsuarioResumenDTO> listarTodos() {
		return usuarioRepository.findAll().stream().map(this::toResumen).toList();
	}

	public List<AdoptanteDTO> listarAdoptantes() {
		return adoptanteRepository.findAll().stream().map(this::toAdoptanteDto).toList();
	}

	public TrabajadorDTO crearTrabajador(TrabajadorDTO dto) {
		if (usuarioRepository.existsByUsername(dto.getUsername())) {
			throw new ConflictException("El username ya existe");
		}
		if (trabajadorRepository.existsByDni(dto.getDni())) {
			throw new ConflictException("El DNI ya esta registrado");
		}
		if (trabajadorRepository.existsByEmail(dto.getEmail())) {
			throw new ConflictException("El email ya esta registrado");
		}
		Trabajador trabajador = new Trabajador();
		trabajador.setUsername(dto.getUsername());
		trabajador.setPassword(passwordEncoder.encode(dto.getPassword()));
		trabajador.setRol("ROLE_TRABAJADOR");
		trabajador.setActivo(true);
		trabajador.setNom_trabajador(dto.getNomTrabajador());
		trabajador.setApe_trabajador(dto.getApeTrabajador());
		trabajador.setDni(dto.getDni());
		trabajador.setFec_nacimiento(dto.getFecNacimiento());
		trabajador.setEmail(dto.getEmail());
		trabajador.setTelefono(dto.getTelefono());
		return toTrabajadorDto(trabajadorRepository.save(trabajador));
	}

	public UsuarioResumenDTO cambiarEstado(Integer id, Boolean activo) {
		if (activo == null) {
			throw new BadRequestException("Debe indicar el estado activo");
		}
		Usuario usuario = usuarioRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
		usuario.setActivo(activo);
		return toResumen(usuarioRepository.save(usuario));
	}

	public PerfilDTO verPerfil(Authentication authentication) {
		Usuario usuario = usuarioAutenticado(authentication);
		return toPerfil(usuario);
	}

	public PerfilDTO actualizarPerfil(Authentication authentication, ActualizarPerfilDTO dto) {
		Usuario usuario = usuarioAutenticado(authentication);
		if (usuario instanceof Adoptante adoptante) {
			if (dto.getNombres() != null) adoptante.setNom_adoptante(dto.getNombres());
			if (dto.getApellidos() != null) adoptante.setApe_adoptante(dto.getApellidos());
			if (dto.getEmail() != null) adoptante.setEmail(dto.getEmail());
			if (dto.getTelefono() != null) adoptante.setTelefono(dto.getTelefono());
			if (dto.getDireccion() != null) adoptante.setDireccion(dto.getDireccion());
			return toPerfil(adoptanteRepository.save(adoptante));
		}
		if (usuario instanceof Trabajador trabajador) {
			if (dto.getNombres() != null) trabajador.setNom_trabajador(dto.getNombres());
			if (dto.getApellidos() != null) trabajador.setApe_trabajador(dto.getApellidos());
			if (dto.getEmail() != null) trabajador.setEmail(dto.getEmail());
			if (dto.getTelefono() != null) trabajador.setTelefono(dto.getTelefono());
			return toPerfil(trabajadorRepository.save(trabajador));
		}
		if ("ROLE_ADOPTANTE".equals(usuario.getRol())) {
			Adoptante adoptante = adoptanteRepository.findById(usuario.getId_usuario())
					.orElseThrow(() -> new NotFoundException("Datos de adoptante no encontrados"));
			if (dto.getNombres() != null) adoptante.setNom_adoptante(dto.getNombres());
			if (dto.getApellidos() != null) adoptante.setApe_adoptante(dto.getApellidos());
			if (dto.getEmail() != null) adoptante.setEmail(dto.getEmail());
			if (dto.getTelefono() != null) adoptante.setTelefono(dto.getTelefono());
			if (dto.getDireccion() != null) adoptante.setDireccion(dto.getDireccion());
			return toPerfil(adoptanteRepository.save(adoptante));
		}
		if ("ROLE_ADMIN".equals(usuario.getRol()) || "ROLE_TRABAJADOR".equals(usuario.getRol())) {
			Trabajador trabajador = trabajadorRepository.findById(usuario.getId_usuario())
					.orElseThrow(() -> new NotFoundException("Datos de trabajador no encontrados"));
			if (dto.getNombres() != null) trabajador.setNom_trabajador(dto.getNombres());
			if (dto.getApellidos() != null) trabajador.setApe_trabajador(dto.getApellidos());
			if (dto.getEmail() != null) trabajador.setEmail(dto.getEmail());
			if (dto.getTelefono() != null) trabajador.setTelefono(dto.getTelefono());
			return toPerfil(trabajadorRepository.save(trabajador));
		}
		return toPerfil(usuarioRepository.save(usuario));
	}

	private Usuario usuarioAutenticado(Authentication authentication) {
		if (authentication == null) {
			throw new NotFoundException("Usuario autenticado no encontrado");
		}
		return usuarioRepository.findByUsername(authentication.getName())
				.orElseThrow(() -> new NotFoundException("Usuario autenticado no encontrado"));
	}

	private UsuarioResumenDTO toResumen(Usuario usuario) {
		return new UsuarioResumenDTO(usuario.getId_usuario(), usuario.getUsername(), usuario.getRol(),
				usuario.getActivo(), usuario.getFechaCreacion(), nombreCompleto(usuario));
	}

	private String nombreCompleto(Usuario usuario) {
		if (usuario instanceof Adoptante a) {
			return (a.getNom_adoptante() + " " + a.getApe_adoptante()).trim();
		}
		if (usuario instanceof Trabajador t) {
			return (t.getNom_trabajador() + " " + t.getApe_trabajador()).trim();
		}
		if ("ROLE_ADOPTANTE".equals(usuario.getRol())) {
			return adoptanteRepository.findById(usuario.getId_usuario())
					.map(a -> (a.getNom_adoptante() + " " + a.getApe_adoptante()).trim())
					.orElse(usuario.getUsername());
		}
		if ("ROLE_ADMIN".equals(usuario.getRol()) || "ROLE_TRABAJADOR".equals(usuario.getRol())) {
			return trabajadorRepository.findById(usuario.getId_usuario())
					.map(t -> (t.getNom_trabajador() + " " + t.getApe_trabajador()).trim())
					.orElse(usuario.getUsername());
		}
		return usuario.getUsername();
	}

	private AdoptanteDTO toAdoptanteDto(Adoptante adoptante) {
		AdoptanteDTO dto = new AdoptanteDTO();
		dto.setId(adoptante.getId_usuario());
		dto.setUsername(adoptante.getUsername());
		dto.setNomAdoptante(adoptante.getNom_adoptante());
		dto.setApeAdoptante(adoptante.getApe_adoptante());
		dto.setFecNacimiento(adoptante.getFec_nacimiento());
		dto.setDni(adoptante.getDni());
		dto.setEmail(adoptante.getEmail());
		dto.setTelefono(adoptante.getTelefono());
		dto.setDireccion(adoptante.getDireccion());
		dto.setActivo(adoptante.getActivo());
		return dto;
	}

	private TrabajadorDTO toTrabajadorDto(Trabajador trabajador) {
		TrabajadorDTO dto = new TrabajadorDTO();
		dto.setId(trabajador.getId_usuario());
		dto.setUsername(trabajador.getUsername());
		dto.setNomTrabajador(trabajador.getNom_trabajador());
		dto.setApeTrabajador(trabajador.getApe_trabajador());
		dto.setDni(trabajador.getDni());
		dto.setFecNacimiento(trabajador.getFec_nacimiento());
		dto.setEmail(trabajador.getEmail());
		dto.setTelefono(trabajador.getTelefono());
		dto.setActivo(trabajador.getActivo());
		return dto;
	}

	private PerfilDTO toPerfil(Usuario usuario) {
		PerfilDTO dto = new PerfilDTO();
		dto.setId(usuario.getId_usuario());
		dto.setUsername(usuario.getUsername());
		dto.setRol(usuario.getRol());
		if (usuario instanceof Adoptante a) {
			dto.setNombres(a.getNom_adoptante());
			dto.setApellidos(a.getApe_adoptante());
			dto.setDni(a.getDni());
			dto.setEmail(a.getEmail());
			dto.setTelefono(a.getTelefono());
			dto.setDireccion(a.getDireccion());
		} else if (usuario instanceof Trabajador t) {
			dto.setNombres(t.getNom_trabajador());
			dto.setApellidos(t.getApe_trabajador());
			dto.setDni(t.getDni());
			dto.setEmail(t.getEmail());
			dto.setTelefono(t.getTelefono());
		} else if ("ROLE_ADOPTANTE".equals(usuario.getRol())) {
			adoptanteRepository.findById(usuario.getId_usuario()).ifPresent(a -> {
				dto.setNombres(a.getNom_adoptante());
				dto.setApellidos(a.getApe_adoptante());
				dto.setDni(a.getDni());
				dto.setEmail(a.getEmail());
				dto.setTelefono(a.getTelefono());
				dto.setDireccion(a.getDireccion());
			});
		} else if ("ROLE_ADMIN".equals(usuario.getRol()) || "ROLE_TRABAJADOR".equals(usuario.getRol())) {
			trabajadorRepository.findById(usuario.getId_usuario()).ifPresent(t -> {
				dto.setNombres(t.getNom_trabajador());
				dto.setApellidos(t.getApe_trabajador());
				dto.setDni(t.getDni());
				dto.setEmail(t.getEmail());
				dto.setTelefono(t.getTelefono());
			});
		}
		return dto;
	}
}
