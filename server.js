import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('❌ Error de conexión a la BD:', err);
    process.exit(1); // Detener el servidor si no puede conectar con la base de datos
  } else {
    console.log('✅ Conectado a la base de datos MySQL');
  }
});

const API_KEY = process.env.API_KEY;

// Middleware para validar la API Key
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ message: 'API Key faltante' });
  }

  if (apiKey !== API_KEY) {
    return res.status(403).json({ message: 'API Key inválida' });
  }
  next();
});

// Obtener todos los eventos
app.get('/events', (req, res) => {
  const sql = 'SELECT * FROM events';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener los eventos:', err);
      return res.status(500).json({ error: 'Error al obtener eventos' });
    }
    const formattedResults = results.map(event => ({
      ...event,
      birthDate: formatDate(event.birthDate),
    }));
    res.json(formattedResults);
  });
});

// Obtener evento por ID
app.get('/events/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM events WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error al obtener el evento por ID:', err);
      return res.status(500).json({ error: 'Error al obtener el evento' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json({ ...result[0], birthDate: formatDate(result[0].birthDate) });
  });
});

// Crear un nuevo evento
app.post('/events', (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { firstName, lastName, identification, birthDate, address } = req.body;

  // Validar campos de entrada
  if (!firstName || !lastName || !identification || !birthDate || !address) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const sql = 'INSERT INTO events (firstName, lastName, identification, birthDate, address) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [firstName, lastName, identification, birthDate, address], (err, result) => {
    if (err) {
      console.error('❌ Error al guardar el evento:', err);
      return res.status(500).json({ error: 'Error al guardar el evento' });
    }
    res.status(201).json({ message: '✅ Evento guardado correctamente', id: result.insertId });
  });
});

// Actualizar un evento
app.put('/events/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, identification, birthDate, address } = req.body;

  // Validar campos de entrada
  if (!firstName || !lastName || !identification || !birthDate || !address) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const sql = 'UPDATE events SET firstName = ?, lastName = ?, identification = ?, birthDate = ?, address = ? WHERE id = ?';
  db.query(sql, [firstName, lastName, identification, birthDate, address, id], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar el evento:', err);
      return res.status(500).json({ error: 'Error al actualizar el evento' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json({ message: '✅ Evento actualizado correctamente' });
  });
});

// Eliminar un evento
app.delete('/events/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM events WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar el evento:', err);
      return res.status(500).json({ error: 'Error al eliminar el evento' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.json({ message: '✅ Evento eliminado correctamente' });
  });
});

// Función para formatear la fecha en formato YYYY-MM-DD
function formatDate(date) {
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch (err) {
    console.error('❌ Error al formatear la fecha:', err);
    return date; // Si la fecha es inválida, retornar la original
  }
}

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
