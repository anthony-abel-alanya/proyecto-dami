package com.proyecto.daw.service;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.proyecto.daw.repository.AdoptanteRepository;
import com.proyecto.daw.repository.MascotaRepository;
import com.proyecto.daw.repository.SolicitudRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

	private final MascotaRepository mascotaRepository;
	private final SolicitudRepository solicitudRepository;
	private final AdoptanteRepository adoptanteRepository;

	public Map<String, Long> resumen() {
		return Map.of(
				"mascotasDisponibles", mascotaRepository.contarPorEstadoAdopcion("DISPONIBLE"),
				"solicitudesPendientes", solicitudRepository.contarPorEstado("PENDIENTE"),
				"adoptantesRegistrados", adoptanteRepository.count(),
				"mascotasAdoptadasEsteMes", solicitudRepository.contarAdoptadasEsteMes());
	}

	public List<Map<String, Object>> solicitudesPorMes() {
		Map<String, Long> cantidades = solicitudRepository.contarSolicitudesPorMes().stream()
				.collect(java.util.stream.Collectors.toMap(
						row -> ((Number) row[0]).intValue() + "-" + ((Number) row[1]).intValue(),
						row -> ((Number) row[2]).longValue()));

		List<Map<String, Object>> result = new ArrayList<>();
		LocalDate cursor = LocalDate.now().minusMonths(5).withDayOfMonth(1);
		Locale locale = new Locale("es", "ES");
		for (int i = 0; i < 6; i++) {
			int anio = cursor.getYear();
			Month month = cursor.getMonth();
			String key = anio + "-" + month.getValue();
			result.add(Map.of(
					"mes", month.getDisplayName(TextStyle.FULL, locale),
					"anio", anio,
					"cantidad", cantidades.getOrDefault(key, 0L)));
			cursor = cursor.plusMonths(1);
		}
		return result;
	}

	public List<Map<String, Object>> mascotasPorCategoria() {
		return mascotaRepository.contarPorEspecie().stream()
				.map(row -> Map.<String, Object>of(
						"categoria", row[0] != null ? row[0].toString() : "Sin tipo",
						"cantidad", ((Number) row[1]).longValue()))
				.toList();
	}
}
