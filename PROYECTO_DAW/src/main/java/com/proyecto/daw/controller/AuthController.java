package com.proyecto.daw.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.daw.model.Adoptante;
import com.proyecto.daw.model.ApiResponse;
import com.proyecto.daw.model.AuthResponse;
import com.proyecto.daw.model.RegistroAdoptanteRequest;
import com.proyecto.daw.model.Usuario;
import com.proyecto.daw.repository.AdoptanteRepository;
import com.proyecto.daw.security.CustomUserDetailsService;
import com.proyecto.daw.security.JwtUtil;
import com.proyecto.daw.service.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AuthController {

	private final AuthenticationManager authenticationManager;
	private final UsuarioService usuarioService;
	private final AdoptanteRepository adoptanteRepository;
	private final PasswordEncoder passwordEncoder;
	private final CustomUserDetailsService userDetailsService;
	private final JwtUtil jwtUtil;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
		String username = credentials.get("username");
		String password = credentials.get("password");

		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

			Usuario usuario = usuarioService.findByUsername(username);
			UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			String token = jwtUtil.generateToken(userDetails, usuario.getRol());

			return ResponseEntity.ok(new AuthResponse(token, usuario.getUsername(), usuario.getRol(), usuario.getId_usuario()));
		} catch (RuntimeException ex) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new ApiResponse("Usuario o contrasena incorrectos"));
		}
	}

	@PostMapping("/registro")
	public ResponseEntity<?> registro(@RequestBody RegistroAdoptanteRequest request) {
		if (usuarioService.existeUsername(request.getUsername())) {
			return ResponseEntity.badRequest().body(new ApiResponse("El usuario ya existe"));
		}
		if (adoptanteRepository.existsByDni(request.getDni())) {
			return ResponseEntity.badRequest().body(new ApiResponse("El DNI ya esta registrado"));
		}
		if (adoptanteRepository.existsByEmail(request.getEmail())) {
			return ResponseEntity.badRequest().body(new ApiResponse("El email ya esta registrado"));
		}

		Adoptante adoptante = new Adoptante();
		adoptante.setUsername(request.getUsername());
		adoptante.setPassword(passwordEncoder.encode(request.getPassword()));
		adoptante.setRol("ROLE_ADOPTANTE");
		adoptante.setActivo(true);
		adoptante.setNom_adoptante(request.getNom_adoptante());
		adoptante.setApe_adoptante(request.getApe_adoptante());
		adoptante.setFec_nacimiento(request.getFec_nacimiento());
		adoptante.setDni(request.getDni());
		adoptante.setEmail(request.getEmail());
		adoptante.setTelefono(request.getTelefono());
		adoptante.setDireccion(request.getDireccion());

		Adoptante guardado = adoptanteRepository.save(adoptante);
		UserDetails userDetails = userDetailsService.loadUserByUsername(guardado.getUsername());
		String token = jwtUtil.generateToken(userDetails, guardado.getRol());

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new AuthResponse(token, guardado.getUsername(), guardado.getRol(), guardado.getId_usuario()));
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout() {
		return ResponseEntity.ok(new ApiResponse("Sesion cerrada correctamente"));
	}
}
