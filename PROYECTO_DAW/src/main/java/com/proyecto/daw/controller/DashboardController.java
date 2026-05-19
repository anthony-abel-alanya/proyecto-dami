package com.proyecto.daw.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.daw.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','TRABAJADOR')")
public class DashboardController {

	private final DashboardService dashboardService;

	@GetMapping("/resumen")
	public Map<String, Long> resumen() {
		return dashboardService.resumen();
	}

	@GetMapping("/solicitudes-por-mes")
	public List<Map<String, Object>> solicitudesPorMes() {
		return dashboardService.solicitudesPorMes();
	}

	@GetMapping("/mascotas-por-categoria")
	public List<Map<String, Object>> mascotasPorCategoria() {
		return dashboardService.mascotasPorCategoria();
	}
}
