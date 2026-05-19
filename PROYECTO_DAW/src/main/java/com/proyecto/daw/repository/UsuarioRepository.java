package com.proyecto.daw.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyecto.daw.model.Usuario;


public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{

	Optional<Usuario> findByUsername(String username);
	
	// Útil para validar que no se repita el nombre de usuario en el registro
    Boolean existsByUsername(String username);

    java.util.List<Usuario> findByRol(String rol);
}
