package com.proyecto.daw.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyecto.daw.model.Trabajador;

public interface TrabajadorRepository extends JpaRepository<Trabajador, Integer> {

	boolean existsByDni(String dni);

	boolean existsByEmail(String email);
}
