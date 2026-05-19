package com.proyecto.daw.exception;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<?> notFound(NotFoundException ex) {
		return error(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage());
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<?> badRequest(BadRequestException ex) {
		return error(HttpStatus.BAD_REQUEST, "BAD_REQUEST", ex.getMessage());
	}

	@ExceptionHandler(ConflictException.class)
	public ResponseEntity<?> conflict(ConflictException ex) {
		return error(HttpStatus.CONFLICT, "CONFLICT", ex.getMessage());
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<?> forbidden(AccessDeniedException ex) {
		return error(HttpStatus.FORBIDDEN, "FORBIDDEN", "No tienes permisos para esta accion");
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> internal(Exception ex) {
		return error(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", ex.getMessage());
	}

	private ResponseEntity<?> error(HttpStatus status, String error, String mensaje) {
		return ResponseEntity.status(status).body(Map.of(
				"error", error,
				"mensaje", mensaje,
				"timestamp", LocalDateTime.now().toString()));
	}
}
