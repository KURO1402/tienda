const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { swaggerUi, swaggerDocs } = require('./config/swagger');

const app = express();
const PORT = 3000;

// 🟢 Middlewares
const allowedOrigins = [
  'https://tienda-seven-ruby.vercel.app', // tu frontend en producción
  'http://localhost:5500', // Live Server local
  'http://127.0.0.1:5500' // alternativa de Live Server
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // permite Postman o curl sin 'origin'
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Bloqueado por CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
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
