const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Endpoints para gestionar las categorías
 */

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida correctamente
 */

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crear una nueva categoría
 *     security:
 *       - bearerAuth: []
 *     tags: [Categorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Bebidas"
 *     responses:
 *       200:
 *         description: Categoría creada correctamente
 */

// Obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categorias');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear nueva categoría
router.post('/', verifyToken, async (req, res) => {
    const { nombre } = req.body;
    try {
        const [result] = await db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);
        res.json({ id: result.insertId, nombre });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar categoría
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        await db.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id]);
        res.json({ id, nombre });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar categoría
router.delete('/:id', verifyToken, async (req, res) => {
const { id } = req.params;
    try {
        await db.query('DELETE FROM categorias WHERE id = ?', [id]);
        res.json({ mensaje: 'Categoría eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;