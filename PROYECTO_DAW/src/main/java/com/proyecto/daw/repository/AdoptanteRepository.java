package com.proyecto.daw.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyecto.daw.model.Adoptante;

public interface AdoptanteRepository extends JpaRepository<Adoptante, Integer>{

	boolean existsByDni(String dni);

	boolean existsByEmail(String email);
}
