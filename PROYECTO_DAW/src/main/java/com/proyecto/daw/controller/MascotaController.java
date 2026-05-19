package com.proyecto.daw.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.proyecto.daw.dto.MascotaDTO;
import com.proyecto.daw.model.ApiResponse;
import com.proyecto.daw.model.Mascota;
import com.proyecto.daw.service.MascotaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mascotas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class MascotaController {

	private final MascotaService service;

	@GetMapping
	public List<MascotaDTO> listar(@RequestParam(required = false) String especie,
			@RequestParam(required = false) Integer idCategoria,
			@RequestParam(required = false) String estadoAdopcion,
			@RequestParam(required = false) String nombre) {
		return service.listarConFiltros(especie, idCategoria, estadoAdopcion, nombre);
	}

	@GetMapping("/{id}")
	public MascotaDTO buscarPorId(@PathVariable(name = "id") int idMascota) {
		return service.buscarDtoPorId(idMascota);
	}

	@PostMapping
	public ResponseEntity<MascotaDTO> registrar(@ModelAttribute Mascota mascota,
			@RequestParam(value = "id_categoria", required = false) Integer idCategoriaSnake,
			@RequestParam(value = "idCategoria", required = false) Integer idCategoria,
			@RequestParam(value = "archivo", required = false) MultipartFile archivo) throws Exception {
		return ResponseEntity.ok(service.guardarConImagenDto(mascota,
				idCategoria != null ? idCategoria : idCategoriaSnake, archivo));
	}

	@PutMapping("/{id}")
	public ResponseEntity<MascotaDTO> actualizar(@PathVariable(name = "id") int idMascota,
			@ModelAttribute Mascota mascota,
			@RequestParam(value = "id_categoria", required = false) Integer idCategoriaSnake,
			@RequestParam(value = "idCategoria", required = false) Integer idCategoria,
			@RequestParam(value = "archivo", required = false) MultipartFile archivo) throws Exception {
		mascota.setId_mascota(idMascota);
		return ResponseEntity.ok(service.guardarConImagenDto(mascota,
				idCategoria != null ? idCategoria : idCategoriaSnake, archivo));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> eliminarLogico(@PathVariable Integer id) {
		Mascota mascota = service.buscarPorId(id);
		if (mascota == null) {
			return ResponseEntity.notFound().build();
		}
		mascota.setEst_adopcion("INACTIVO");
		service.guardar(mascota);
		return ResponseEntity.ok(new ApiResponse("Mascota dada de baja correctamente"));
	}
}
