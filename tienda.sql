-- Tabla: categorias
CREATE TABLE categorias (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO categorias (id, nombre) VALUES
(1, 'Ropa');

-- Tabla: productos
CREATE TABLE productos (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  categoria_id INT(11) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY categoria_id (categoria_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO productos (id, nombre, descripcion, precio, categoria_id) VALUES
(1, 'Chompa', '', 30.00, 1),
(2, 'Pantalon', '', 10.00, 1);

-- Tabla: imagenes_productos
CREATE TABLE imagenes_productos (
  id INT(11) NOT NULL AUTO_INCREMENT,
  url VARCHAR(255) NOT NULL,
  producto_id INT(11) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY producto_id (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO imagenes_productos (id, url, producto_id) VALUES
(1, 'https://carmenjimenez.pe/wp-content/uploads/2022/06/282997203_1308329506244000_5750662929848772681_n.jpg', 1),
(2, 'https://hmperu.vtexassets.com/unsafe/768x0/center/middle/https%3A%2F%2Fhmperu.vtexassets.com%2Farquivos%2Fids%2F5687000%2FPantalon-de-vestir-en-twill---Negro---H-M-PE.jpg%3Fv%3D638857574766170000', 2);

-- Tabla: usuarios
CREATE TABLE usuarios (
  idUsuario INT(11) NOT NULL AUTO_INCREMENT,
  usuario VARCHAR(50) NOT NULL,
  password CHAR(32) NOT NULL,
  PRIMARY KEY (idUsuario),
  UNIQUE KEY usuario (usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;