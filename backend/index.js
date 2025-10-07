const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { swaggerUi, swaggerDocs } = require('./config/swagger');

const app = express();
const PORT = 3000;

// 🟢 Middlewares
app.use(cors());
app.use(bodyParser.json());

// 🟡 Rutas de documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🧱 Importar rutas
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const imagenesRoutes = require('./routes/imagenes');
const usuariosRoutes = require('./routes/usuarios');

// 🧩 Registrar rutas con prefijos
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/imagenes', imagenesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});
