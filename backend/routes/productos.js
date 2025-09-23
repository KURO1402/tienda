const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// Obtener todos los productos con su categoría
router.get('/', async (req, res) => {
    try {
    const [rows] = await db.query(`
    SELECT p.id, p.nombre, p.descripcion, p.precio, c.nombre AS categoria
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    `);
    res.json(rows);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// Crear producto
router.post('/', verifyToken, async (req, res) => {
    const { nombre, descripcion, precio, categoria_id } = req.body;
    try {
        const [result] = await db.query('INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES (?, ?, ?, ?)',[nombre, descripcion, precio, categoria_id]);
        res.json({ id: result.insertId, nombre, descripcion, precio, categoria_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar producto
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria_id } = req.body;
    try {
        await db.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ? WHERE id = ?',[nombre, descripcion, precio, categoria_id, id]);
        res.json({ id, nombre,descripcion, precio, categoria_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar producto
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM productos WHERE id = ?', [id]);
        res.json({ mensaje: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;