CREATE DATABASE IF NOT EXISTS adopcion_mascotas;
USE adopcion_mascotas;

DROP TABLE IF EXISTS reporte_perdida;

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(30) NOT NULL DEFAULT 'ROLE_ADOPTANTE',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_rol_valido CHECK (rol IN ('ROLE_ADMIN', 'ROLE_TRABAJADOR', 'ROLE_ADOPTANTE'))
);

CREATE TABLE IF NOT EXISTS trabajador (
    id_usuario INT PRIMARY KEY,
    nom_trabajador VARCHAR(100) NOT NULL,
    ape_trabajador VARCHAR(100) NOT NULL,
    dni CHAR(8) UNIQUE NOT NULL,
    fec_nacimiento DATE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono CHAR(9) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS adoptante (
    id_usuario INT PRIMARY KEY,
    nom_adoptante VARCHAR(100) NOT NULL,
    ape_adoptante VARCHAR(100) NOT NULL,
    fec_nacimiento DATE NOT NULL,
    dni CHAR(8) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono CHAR(9) NOT NULL,
    direccion VARCHAR(150),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT NULL
);

CREATE TABLE IF NOT EXISTS mascota (
    id_mascota INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    especie VARCHAR(20) NOT NULL,
    raza VARCHAR(50) NOT NULL,
    edad_anios INT DEFAULT 0,
    edad_meses INT DEFAULT 0,
    estado_salud VARCHAR(50) NOT NULL,
    estado_adopcion VARCHAR(20) DEFAULT 'DISPONIBLE',
    ruta_imagen VARCHAR(255),
    id_categoria INT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_edad_anios CHECK (edad_anios >= 0),
    CONSTRAINT chk_edad_meses CHECK (edad_meses >= 0 AND edad_meses < 12),
    CONSTRAINT chk_estado_salud CHECK (estado_salud IN ('SIN NOVEDADES','EN TRATAMIENTO','CRITICO')),
    CONSTRAINT chk_estado_adopt CHECK (estado_adopcion IN ('DISPONIBLE','RESERVADO','ADOPTADO','INACTIVO')),
    CONSTRAINT fk_mascota_categoria FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS solicitud (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    fecha_registro DATE DEFAULT (CURRENT_DATE),
    id_adoptante INT NOT NULL,
    id_mascota INT NOT NULL,
    comentario TEXT,
    ruta_pdf_acta VARCHAR(255) NULL,
    ruta_pdf_firmado VARCHAR(255) NULL,
    fecha_acta TIMESTAMP NULL,
    estado_acta VARCHAR(20) DEFAULT 'SIN_ACTA',
    estado_solicitud VARCHAR(20) DEFAULT 'PENDIENTE',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_estado_acta CHECK (estado_acta IN ('SIN_ACTA','GENERADA','FIRMADA','VERIFICADA')),
    CONSTRAINT chk_solicitud_estado CHECK (estado_solicitud IN ('PENDIENTE','EN_PROCESO','APROBADA','RECHAZADA')),
    FOREIGN KEY (id_adoptante) REFERENCES adoptante(id_usuario),
    FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota)
);

INSERT INTO categoria (nombre, descripcion)
SELECT 'Perros', 'Mascotas caninas de diversas razas' WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Perros');
INSERT INTO categoria (nombre, descripcion)
SELECT 'Gatos', 'Mascotas felinas domesticadas' WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Gatos');
INSERT INTO categoria (nombre, descripcion)
SELECT 'Conejos', 'Conejos y roedores pequenos' WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Conejos');
INSERT INTO categoria (nombre, descripcion)
SELECT 'Aves', 'Pajaros y loros domesticos' WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Aves');
INSERT INTO categoria (nombre, descripcion)
SELECT 'Otros', 'Otras mascotas variadas' WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nombre = 'Otros');


/* CONTRASENIA 123 EN TODOS LOS USUARIOS */
INSERT INTO usuario (username, password, rol, activo)
SELECT 'admin', '$2a$12$sF84YBQQDkPrtIYv8rjr5.eBr41yq2hPSKvbn490SOBMCtagHegNe', 'ROLE_ADMIN', TRUE
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'admin');
INSERT INTO usuario (username, password, rol, activo)
SELECT 'pepe', '$2a$12$sF84YBQQDkPrtIYv8rjr5.eBr41yq2hPSKvbn490SOBMCtagHegNe', 'ROLE_TRABAJADOR', TRUE
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'pepe');
INSERT INTO usuario (username, password, rol, activo)
SELECT 'rodrigo', '$2a$12$sF84YBQQDkPrtIYv8rjr5.eBr41yq2hPSKvbn490SOBMCtagHegNe', 'ROLE_ADOPTANTE', TRUE
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'rodrigo');
INSERT INTO usuario (username, password, rol, activo)
SELECT 'ana', '$2a$12$sF84YBQQDkPrtIYv8rjr5.eBr41yq2hPSKvbn490SOBMCtagHegNe', 'ROLE_ADOPTANTE', TRUE
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'ana');
INSERT INTO usuario (username, password, rol, activo)
SELECT 'jose', '$2a$12$sF84YBQQDkPrtIYv8rjr5.eBr41yq2hPSKvbn490SOBMCtagHegNe', 'ROLE_ADOPTANTE', TRUE
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'jose');


INSERT INTO trabajador (id_usuario, nom_trabajador, ape_trabajador, dni, fec_nacimiento, email, telefono)
SELECT id_usuario, 'Admin', 'General', '11111111', '1990-01-01', 'admin@pet.com', '999888777'
FROM usuario WHERE username = 'admin' AND NOT EXISTS (SELECT 1 FROM trabajador WHERE dni = '11111111');
INSERT INTO trabajador (id_usuario, nom_trabajador, ape_trabajador, dni, fec_nacimiento, email, telefono)
SELECT id_usuario, 'Pepe', 'Lucho', '22222222', '1995-05-15', 'pepe@pet.com', '999111222'
FROM usuario WHERE username = 'pepe' AND NOT EXISTS (SELECT 1 FROM trabajador WHERE dni = '22222222');


INSERT INTO adoptante (id_usuario, nom_adoptante, ape_adoptante, fec_nacimiento, dni, email, telefono, direccion)
SELECT id_usuario, 'Rodrigo', 'Leon', '2000-10-10', '33333333', 'rodrigo@mail.com', '987654321', 'Av. Lima 123'
FROM usuario WHERE username = 'rodrigo' AND NOT EXISTS (SELECT 1 FROM adoptante WHERE dni = '33333333');
INSERT INTO adoptante (id_usuario, nom_adoptante, ape_adoptante, fec_nacimiento, dni, email, telefono, direccion)
SELECT id_usuario, 'Ana', 'Garcia', '1998-03-25', '44444444', 'ana@mail.com', '912345678', 'Calle Las Flores 456, Surco'
FROM usuario WHERE username = 'ana' AND NOT EXISTS (SELECT 1 FROM adoptante WHERE dni = '44444444');
INSERT INTO adoptante (id_usuario, nom_adoptante, ape_adoptante, fec_nacimiento, dni, email, telefono, direccion)
SELECT id_usuario, 'Jose', 'Martinez', '1995-07-12', '55555555', 'jose@mail.com', '987123456', 'Jr. Los Alamos 789, Los Olivos'
FROM usuario WHERE username = 'jose' AND NOT EXISTS (SELECT 1 FROM adoptante WHERE dni = '55555555');


INSERT INTO mascota (nombre, especie, raza, edad_anios, edad_meses, estado_salud, estado_adopcion, id_categoria)
SELECT 'Firulais', 'Perro', 'Labrador', 2, 5, 'SIN NOVEDADES', 'DISPONIBLE', id_categoria
FROM categoria WHERE nombre = 'Perros' AND NOT EXISTS (SELECT 1 FROM mascota WHERE nombre = 'Firulais');
INSERT INTO mascota (nombre, especie, raza, edad_anios, edad_meses, estado_salud, estado_adopcion, id_categoria)
SELECT 'Michi', 'Gato', 'Persa', 1, 0, 'EN TRATAMIENTO', 'DISPONIBLE', id_categoria
FROM categoria WHERE nombre = 'Gatos' AND NOT EXISTS (SELECT 1 FROM mascota WHERE nombre = 'Michi');
INSERT INTO mascota (nombre, especie, raza, edad_anios, edad_meses, estado_salud, estado_adopcion, id_categoria)
SELECT 'Rex', 'Perro', 'Ovejero Aleman', 3, 2, 'SIN NOVEDADES', 'DISPONIBLE', id_categoria
FROM categoria WHERE nombre = 'Perros' AND NOT EXISTS (SELECT 1 FROM mascota WHERE nombre = 'Rex');
INSERT INTO mascota (nombre, especie, raza, edad_anios, edad_meses, estado_salud, estado_adopcion, id_categoria)
SELECT 'Luna', 'Gato', 'Siames', 0, 8, 'SIN NOVEDADES', 'DISPONIBLE', id_categoria
FROM categoria WHERE nombre = 'Gatos' AND NOT EXISTS (SELECT 1 FROM mascota WHERE nombre = 'Luna');
INSERT INTO mascota (nombre, especie, raza, edad_anios, edad_meses, estado_salud, estado_adopcion, id_categoria)
SELECT 'Toto', 'Conejo', 'Conejo Enano', 0, 5, 'SIN NOVEDADES', 'DISPONIBLE', id_categoria
FROM categoria WHERE nombre = 'Conejos' AND NOT EXISTS (SELECT 1 FROM mascota WHERE nombre = 'Toto');


INSERT INTO solicitud (id_adoptante, id_mascota, comentario, estado_solicitud)
SELECT a.id_usuario, m.id_mascota, 'Solicitud de prueba para Firulais', 'PENDIENTE'
FROM adoptante a JOIN mascota m ON m.nombre = 'Firulais'
WHERE a.dni = '33333333' AND NOT EXISTS (SELECT 1 FROM solicitud WHERE id_adoptante = a.id_usuario AND id_mascota = m.id_mascota);
INSERT INTO solicitud (id_adoptante, id_mascota, comentario, estado_solicitud)
SELECT a.id_usuario, m.id_mascota, 'Solicitud de prueba para Michi', 'PENDIENTE'
FROM adoptante a JOIN mascota m ON m.nombre = 'Michi'
WHERE a.dni = '44444444' AND NOT EXISTS (SELECT 1 FROM solicitud WHERE id_adoptante = a.id_usuario AND id_mascota = m.id_mascota);
