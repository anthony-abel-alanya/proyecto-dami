package com.proyecto.daw.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.proyecto.daw.dto.MascotaDTO;
import com.proyecto.daw.exception.NotFoundException;
import com.proyecto.daw.model.Categoria;
import com.proyecto.daw.model.Mascota;
import com.proyecto.daw.repository.CategoriaRepository;
import com.proyecto.daw.repository.MascotaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MascotaService {

	private final MascotaRepository repo;
	private final CategoriaRepository categoriaRepository;

	@Value("${app.upload.dir:uploads/}")
	private String uploadDir;

	public List<MascotaDTO> listarConFiltros(String especie, Integer idCategoria, String estadoAdopcion, String nombre) {
		return repo.buscarConFiltros(blankToNull(especie), idCategoria, blankToNull(estadoAdopcion), blankToNull(nombre))
				.stream().map(this::toDto).toList();
	}

	public List<Mascota> listarTodas() {
		return repo.findAll();
	}

	public MascotaDTO buscarDtoPorId(Integer id) {
		return toDto(buscarObligatoria(id));
	}

	public Mascota buscarPorId(Integer id) {
		return repo.findById(id).orElse(null);
	}

	public Mascota guardar(Mascota mascota) {
		return repo.save(mascota);
	}

	public MascotaDTO guardarConImagenDto(Mascota mascota, Integer idCategoria, MultipartFile archivo) throws IOException {
		return toDto(guardarConImagen(mascota, idCategoria, archivo));
	}

	public Mascota guardarConImagen(Mascota mascota, MultipartFile archivo) throws IOException {
		Integer idCategoria = mascota.getCategoria() != null ? mascota.getCategoria().getIdCategoria() : null;
		return guardarConImagen(mascota, idCategoria, archivo);
	}

	public Mascota guardarConImagen(Mascota mascota, Integer idCategoria, MultipartFile archivo) throws IOException {
		if (idCategoria != null) {
			Categoria categoria = categoriaRepository.findById(idCategoria)
					.orElseThrow(() -> new NotFoundException("Categoria no encontrada"));
			mascota.setCategoria(categoria);
		}
		if (archivo != null && !archivo.isEmpty()) {
			Path directorioImagenes = Path.of(uploadDir, "fotos-mascotas");
			Files.createDirectories(directorioImagenes);
			String nombreUnico = UUID.randomUUID() + "_" + archivo.getOriginalFilename();
			Path rutaCompleta = directorioImagenes.resolve(nombreUnico);
			Files.copy(archivo.getInputStream(), rutaCompleta);
			mascota.setRuta_imagen("fotos-mascotas/" + nombreUnico);
		} else if (mascota.getId_mascota() != null) {
			Mascota existente = repo.findById(mascota.getId_mascota()).orElse(null);
			if (existente != null) {
				mascota.setRuta_imagen(existente.getRuta_imagen());
				if (idCategoria == null) {
					mascota.setCategoria(existente.getCategoria());
				}
			}
		}
		return repo.save(mascota);
	}

	public void eliminar(Integer id) {
		repo.deleteById(id);
	}

	public List<Mascota> listarDisponibles() {
		return repo.buscarPorEstado("DISPONIBLE");
	}

	public MascotaDTO toDto(Mascota mascota) {
		MascotaDTO dto = new MascotaDTO();
		dto.setIdMascota(mascota.getId_mascota());
		dto.setNombre(mascota.getNombre());
		dto.setEspecie(mascota.getEspecie());
		dto.setRaza(mascota.getRaza());
		dto.setEdadAnios(mascota.getEdad_anios());
		dto.setEdadMeses(mascota.getEdad_meses());
		dto.setDescripcion(mascota.getDescripcion());
		dto.setEstadoSalud(mascota.getEst_salud());
		dto.setEstadoAdopcion(mascota.getEst_adopcion());
		dto.setRutaImagen(mascota.getRuta_imagen());
		if (mascota.getCategoria() != null) {
			dto.setCategoriaId(mascota.getCategoria().getIdCategoria());
			dto.setCategoriaNombre(mascota.getCategoria().getNombre());
		}
		return dto;
	}

	private Mascota buscarObligatoria(Integer id) {
		return repo.findById(id).orElseThrow(() -> new NotFoundException("Mascota no encontrada"));
	}

	private String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value;
	}
}
