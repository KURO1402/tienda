const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

/**
 * @swagger
 * tags:
 *   name: Imágenes
 *   description: Endpoints para gestionar imágenes de productos
 */

/**
 * @swagger
 * /api/imagenes:
 *   get:
 *     summary: Obtener todas las imágenes de todos los productos
 *     tags: [Imágenes]
 *     responses:
 *       200:
 *         description: Lista de imágenes obtenida correctamente
 */

/**
 * @swagger
 * /api/imagenes/{producto_id}:
 *   get:
 *     summary: Obtener imágenes de un producto específico
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: producto_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Lista de imágenes del producto
 */

/**
 * @swagger
 * /api/imagenes:
 *   post:
 *     summary: Agregar una imagen a un producto
 *     security:
 *       - bearerAuth: []
 *     tags: [Imágenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://ejemplo.com/imagen.jpg"
 *               producto_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Imagen agregada correctamente
 */

/**
 * @swagger
 * /api/imagenes/{producto_id}:
 *   put:
 *     summary: Actualizar la URL de una imagen de producto
 *     security:
 *       - bearerAuth: []
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: producto_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://ejemplo.com/nueva-imagen.jpg"
 *     responses:
 *       200:
 *         description: Imagen actualizada correctamente
 */

/**
 * @swagger
 * /api/imagenes/{id}:
 *   delete:
 *     summary: Eliminar una imagen por ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la imagen a eliminar
 *     responses:
 *       200:
 *         description: Imagen eliminada correctamente
 */

// Obtener imágenes de un producto
router.get('/:producto_id', async (req, res) => {
    const { producto_id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM imagenes_productos WHERE producto_id = ?',[producto_id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener todas las imágenes de todos los productos y con su producto
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT i.id, i.url, i.producto_id, p.nombre FROM imagenes_productos i INNER JOIN productos p ON p.id = i.producto_id");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar imagen a un producto
router.post('/', verifyToken, async (req, res) => {
    const { url, producto_id } = req.body;
    try {
        const [result] = await db.query('INSERT INTO imagenes_productos (url, producto_id) VALUES (?, ?)',[url, producto_id]);
        res.json({ id: result.insertId, url, producto_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Actualizar imagen de producto
router.put('/:producto_id', verifyToken, async (req, res) => {
    const { producto_id } = req.params;
    const { url } = req.body;
    try {
        await db.query("UPDATE imagenes_productos SET url = ? WHERE id = ?", [url, producto_id]);
        res.json({ producto_id, url });
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

// Eliminar imagen
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM imagenes_productos WHERE id = ?', [id]);
        res.json({ mensaje: 'Imagen eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;