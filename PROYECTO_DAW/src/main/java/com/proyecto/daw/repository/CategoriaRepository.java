package com.proyecto.daw.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyecto.daw.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

	Optional<Categoria> findByNombreIgnoreCase(String nombre);

	boolean existsByNombreIgnoreCase(String nombre);
}
