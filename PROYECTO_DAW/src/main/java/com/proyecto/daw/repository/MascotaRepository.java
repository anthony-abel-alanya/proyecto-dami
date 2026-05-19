package com.proyecto.daw.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.proyecto.daw.model.Mascota;

public interface MascotaRepository extends JpaRepository<Mascota, Integer> {

	@Query("SELECT m FROM Mascota m WHERE m.est_adopcion = :estado")
	List<Mascota> buscarPorEstado(@Param("estado") String estado);

	@Query("SELECT COUNT(m) FROM Mascota m WHERE m.est_adopcion = :estado")
	long contarPorEstadoAdopcion(@Param("estado") String estado);

	@Query("SELECT COUNT(m) FROM Mascota m WHERE m.categoria.idCategoria = :idCategoria")
	long contarPorCategoria(@Param("idCategoria") Integer idCategoria);

	@Query("SELECT m.especie, COUNT(m) FROM Mascota m GROUP BY m.especie ORDER BY COUNT(m) DESC, m.especie ASC")
	List<Object[]> contarPorEspecie();

	@Query("""
			SELECT m FROM Mascota m
			WHERE (:especie IS NULL OR LOWER(m.especie) = LOWER(:especie))
			  AND (:idCategoria IS NULL OR m.categoria.idCategoria = :idCategoria)
			  AND (:estadoAdopcion IS NULL OR m.est_adopcion = :estadoAdopcion)
			  AND (:nombre IS NULL OR LOWER(m.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')))
			ORDER BY m.id_mascota DESC
			""")
	List<Mascota> buscarConFiltros(@Param("especie") String especie,
			@Param("idCategoria") Integer idCategoria,
			@Param("estadoAdopcion") String estadoAdopcion,
			@Param("nombre") String nombre);
}
