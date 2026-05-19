package com.proyecto.daw.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.daw.dto.ActualizarPerfilDTO;
import com.proyecto.daw.dto.AdoptanteDTO;
import com.proyecto.daw.dto.EstadoCuentaDTO;
import com.proyecto.daw.dto.PerfilDTO;
import com.proyecto.daw.dto.TrabajadorDTO;
import com.proyecto.daw.dto.UsuarioResumenDTO;
import com.proyecto.daw.service.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class UsuarioController {

	private final UsuarioService usuarioService;

	@GetMapping
	public List<UsuarioResumenDTO> listar() {
		return usuarioService.listarTodos();
	}

	@GetMapping("/adoptantes")
	public List<AdoptanteDTO> listarAdoptantes() {
		return usuarioService.listarAdoptantes();
	}

	@PostMapping("/trabajador")
	public TrabajadorDTO crearTrabajador(@RequestBody TrabajadorDTO dto) {
		return usuarioService.crearTrabajador(dto);
	}

	@PutMapping("/{id}/estado")
	public UsuarioResumenDTO cambiarEstado(@PathVariable Integer id, @RequestBody EstadoCuentaDTO dto) {
		return usuarioService.cambiarEstado(id, dto.getActivo());
	}

	@GetMapping("/perfil")
	public PerfilDTO perfil(Authentication authentication) {
		return usuarioService.verPerfil(authentication);
	}

	@PutMapping("/perfil")
	public PerfilDTO actualizarPerfil(Authentication authentication, @RequestBody ActualizarPerfilDTO dto) {
		return usuarioService.actualizarPerfil(authentication, dto);
	}
}
