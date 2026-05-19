package com.proyecto.daw.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.daw.dto.CategoriaDTO;
import com.proyecto.daw.service.CategoriaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class CategoriaController {

	private final CategoriaService categoriaService;

	@GetMapping
	public List<CategoriaDTO> listar() {
		return categoriaService.listar();
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<CategoriaDTO> crear(@RequestBody CategoriaDTO dto) {
		return ResponseEntity.ok(categoriaService.crear(dto));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public CategoriaDTO actualizar(@PathVariable Integer id, @RequestBody CategoriaDTO dto) {
		return categoriaService.actualizar(id, dto);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
		categoriaService.eliminar(id);
		return ResponseEntity.noContent().build();
	}
}
