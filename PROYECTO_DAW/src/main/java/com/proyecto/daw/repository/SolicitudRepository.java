package com.proyecto.daw.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.proyecto.daw.model.Solicitud;

public interface SolicitudRepository extends JpaRepository<Solicitud, Integer> {

	@Query("SELECT s FROM Solicitud s JOIN FETCH s.adoptante JOIN FETCH s.mascota ORDER BY s.id_solicitud DESC")
	List<Solicitud> listarSolicitudes();

	@Query("SELECT s FROM Solicitud s JOIN FETCH s.adoptante JOIN FETCH s.mascota WHERE s.adoptante.id_usuario = :idUsuario ORDER BY s.id_solicitud DESC")
	List<Solicitud> listarPorAdoptante(@Param("idUsuario") Integer idUsuario);

	@Query("SELECT s FROM Solicitud s JOIN FETCH s.adoptante JOIN FETCH s.mascota WHERE s.id_solicitud = :id")
	java.util.Optional<Solicitud> buscarDetallePorId(@Param("id") Integer id);

	@Query("SELECT COUNT(s) FROM Solicitud s WHERE s.estado_solicitud = :estado")
	long contarPorEstado(@Param("estado") String estado);

	@Query("SELECT COUNT(s) FROM Solicitud s WHERE s.estado_solicitud = 'APROBADA' AND MONTH(s.fechaActualizacion) = MONTH(CURRENT_DATE) AND YEAR(s.fechaActualizacion) = YEAR(CURRENT_DATE)")
	long contarAdoptadasEsteMes();

	@Query(value = """
			SELECT YEAR(fecha_creacion) anio, MONTH(fecha_creacion) mes, COUNT(*) cantidad
			FROM solicitud
			WHERE fecha_creacion >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
			GROUP BY YEAR(fecha_creacion), MONTH(fecha_creacion)
			ORDER BY anio, mes
			""", nativeQuery = true)
	List<Object[]> contarSolicitudesPorMes();
}
