/*TABLA VEHICULOS*/

CREATE TABLE `vehiculos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marca` varchar(45) NOT NULL,
  `modelo` varchar(45) NOT NULL,
  `patente` varchar(45) NOT NULL,
  `ano` int NOT NULL,
  `capacidad_carga` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patente_UNIQUE` (`patente`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

/*TABLA CONDUCTORES*/

CREATE TABLE `conductores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `licencia` varchar(10) NOT NULL,
  `vencimiento_licencia` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni_UNIQUE` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=

/*TABLA VIAJES*/

CREATE TABLE `viajes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehiculo_id` int NOT NULL,
  `conductor_id` int NOT NULL,
  `fecha_salida` date NOT NULL,
  `fecha_llegada` date NOT NULL,
  `origen` varchar(45) NOT NULL,
  `destino` varchar(45) NOT NULL,
  `kilometros` decimal(10,2) NOT NULL,
  `observaciones` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_viajes_conductores_idx` (`conductor_id`),
  KEY `fk_viajes_vehiculos_idx` (`vehiculo_id`),
  CONSTRAINT `fk_viajes_conductores` FOREIGN KEY (`conductor_id`) REFERENCES `conductores` (`id`),
  CONSTRAINT `fk_viajes_vehiculos` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

/*TABLA USUARIOS*/

CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
