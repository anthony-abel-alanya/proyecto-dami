package com.proyecto.daw.service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.proyecto.daw.exception.NotFoundException;
import com.proyecto.daw.model.Adoptante;
import com.proyecto.daw.model.Mascota;
import com.proyecto.daw.model.Solicitud;
import com.proyecto.daw.repository.SolicitudRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PdfService {

	private final SolicitudRepository solicitudRepository;

	@Value("${app.upload.dir:uploads/}")
	private String uploadDir;

	@Transactional
	public byte[] generarActaAdopcion(Integer idSolicitud) throws Exception {
		Solicitud solicitud = solicitudRepository.buscarDetallePorId(idSolicitud)
				.orElseThrow(() -> new NotFoundException("Solicitud no encontrada"));

		ByteArrayOutputStream output = new ByteArrayOutputStream();
		Document document = new Document();
		PdfWriter.getInstance(document, output);
		document.open();

		Font title = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, new Color(26, 86, 160));
		Font subtitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
		Font normal = FontFactory.getFont(FontFactory.HELVETICA, 11);

		document.add(new Paragraph("ACTA DE ADOPCION DE MASCOTA", title));
		document.add(new Paragraph("Refugio Animal AdoptaPet", subtitle));
		document.add(new Paragraph("Fecha de generacion: " + LocalDateTime.now(), normal));
		document.add(new Paragraph(" "));

		Adoptante adoptante = solicitud.getAdoptante();
		Mascota mascota = solicitud.getMascota();
		document.add(new Paragraph("Datos del adoptante", subtitle));
		document.add(new Paragraph("Nombre: " + adoptante.getNom_adoptante() + " " + adoptante.getApe_adoptante(), normal));
		document.add(new Paragraph("DNI: " + adoptante.getDni(), normal));
		document.add(new Paragraph("Email: " + adoptante.getEmail(), normal));
		document.add(new Paragraph("Telefono: " + adoptante.getTelefono(), normal));
		document.add(new Paragraph("Direccion: " + adoptante.getDireccion(), normal));
		document.add(new Paragraph(" "));

		document.add(new Paragraph("Datos de la mascota", subtitle));
		document.add(new Paragraph("Nombre: " + mascota.getNombre(), normal));
		document.add(new Paragraph("Especie: " + mascota.getEspecie(), normal));
		document.add(new Paragraph("Raza: " + mascota.getRaza(), normal));
		document.add(new Paragraph("Edad: " + mascota.getEdad_anios() + " años y " + mascota.getEdad_meses() + " meses", normal));
		document.add(new Paragraph("Estado de salud: " + mascota.getEst_salud(), normal));
		document.add(new Paragraph(" "));

		document.add(new Paragraph("Compromiso de adopcion", subtitle));
		document.add(new Paragraph(
				"El adoptante se compromete a brindar alimentacion, cuidado veterinario, proteccion, afecto y un hogar responsable a la mascota adoptada. Asimismo, declara que la informacion entregada es verdadera y acepta el seguimiento del refugio cuando sea necesario.",
				normal));
		document.add(new Paragraph(" "));
		document.add(new Paragraph("Firma del adoptante: ________________________________", normal));
		document.add(new Paragraph(" "));
		document.add(new Paragraph("Numero de solicitud: " + solicitud.getId_solicitud(), normal));

		document.close();
		byte[] bytes = output.toByteArray();

		Path actasDir = Path.of(uploadDir, "actas");
		Files.createDirectories(actasDir);
		String fileName = "acta_solicitud_" + idSolicitud + ".pdf";
		Files.write(actasDir.resolve(fileName), bytes);

		solicitud.setActa_pdf("actas/" + fileName);
		solicitud.setEstadoActa("GENERADA");
		solicitud.setEstado_solicitud("EN_PROCESO");
		solicitud.setFechaActa(LocalDateTime.now());
		solicitud.getMascota().setEst_adopcion("RESERVADO");
		solicitudRepository.save(solicitud);

		return bytes;
	}
}
