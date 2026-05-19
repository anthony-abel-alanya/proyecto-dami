package com.proyecto.daw.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.proyecto.daw.dto.CategoriaDTO;
import com.proyecto.daw.exception.BadRequestException;
import com.proyecto.daw.exception.ConflictException;
import com.proyecto.daw.exception.NotFoundException;
import com.proyecto.daw.model.Categoria;
import com.proyecto.daw.repository.CategoriaRepository;
import com.proyecto.daw.repository.MascotaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaService {

	private final CategoriaRepository categoriaRepository;
	private final MascotaRepository mascotaRepository;

	public List<CategoriaDTO> listar() {
		return categoriaRepository.findAll().stream()
				.map(this::toDto)
				.toList();
	}

	public CategoriaDTO crear(CategoriaDTO dto) {
		validarNombre(dto.getNombre());
		if (categoriaRepository.existsByNombreIgnoreCase(dto.getNombre().trim())) {
			throw new ConflictException("Ya existe una categoria con ese nombre");
		}
		Categoria categoria = new Categoria();
		categoria.setNombre(dto.getNombre().trim());
		categoria.setDescripcion(dto.getDescripcion());
		return toDto(categoriaRepository.save(categoria));
	}

	public CategoriaDTO actualizar(Integer id, CategoriaDTO dto) {
		validarNombre(dto.getNombre());
		Categoria categoria = categoriaRepository.findById(id)
				.orElseThrow(() -> new NotFoundException("Categoria no encontrada"));
		categoriaRepository.findByNombreIgnoreCase(dto.getNombre().trim())
				.filter(c -> !c.getIdCategoria().equals(id))
				.ifPresent(c -> {
					throw new ConflictException("Ya existe una categoria con ese nombre");
				});
		categoria.setNombre(dto.getNombre().trim());
		categoria.setDescripcion(dto.getDescripcion());
		return toDto(categoriaRepository.save(categoria));
	}

	public void eliminar(Integer id) {
		if (!categoriaRepository.existsById(id)) {
			throw new NotFoundException("Categoria no encontrada");
		}
		if (mascotaRepository.contarPorCategoria(id) > 0) {
			throw new ConflictException("No se puede eliminar una categoria con mascotas asociadas");
		}
		categoriaRepository.deleteById(id);
	}

	private CategoriaDTO toDto(Categoria categoria) {
		return new CategoriaDTO(categoria.getIdCategoria(), categoria.getNombre(), categoria.getDescripcion(),
				mascotaRepository.contarPorCategoria(categoria.getIdCategoria()));
	}

	private void validarNombre(String nombre) {
		if (nombre == null || nombre.trim().isEmpty()) {
			throw new BadRequestException("El nombre de la categoria es obligatorio");
		}
	}
}
