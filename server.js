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

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'events_db',
});

db.connect(err => {
  if (err) {
    console.error('Error de conexión a la BD:', err);
  } else {
    console.log('✅ Conectado a la base de datos MySQL');
  }
});

const API_KEY = process.env.API_KEY; 

app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ message: 'API Key faltante' });
  }

  if (apiKey !== API_KEY) {
    return res.status(403).json({ message: 'API Key invalida' });
  }
  next();
});

app.get('/events', (req, res) => {
  const sql = 'SELECT * FROM events';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener los eventos:', err);
      res.status(500).json({ error: 'Error al obtener eventos' });
    } else {
      const formattedResults = results.map(event => ({
        ...event,
        date: new Date(event.date).toISOString().split('T')[0],
        time: event.time ? event.time.substring(0, 5) : '',
      }));
      res.json(formattedResults);
    }
  });
});

app.get('/events/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM events WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error al obtener el evento por ID:', err);
      res.status(500).json({ error: 'Error al obtener el evento' });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Evento no encontrado' });
    } else {
      res.json(result[0]);
    }
  });
});

app.post('/events', (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { name, date, time, location, description } = req.body;
  const formattedTime = time.length === 5 ? `${time}:00` : time;

  const sql = 'INSERT INTO events (name, date, time, location, description) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, date, formattedTime, location, description], (err, result) => {
    if (err) {
      console.error('❌ Error al guardar el evento:', err);
      res.status(500).json({ error: 'Error al guardar el evento' });
    } else {
      res.status(201).json({ message: '✅ Evento guardado correctamente', id: result.insertId });
    }
  });
});

app.put('/events/:id', (req, res) => {
  const { id } = req.params;
  const { name, date, time, location, description } = req.body;
  const formattedTime = time.length === 5 ? `${time}:00` : time;
  const sql = 'UPDATE events SET name = ?, date = ?, time = ?, location = ?, description = ? WHERE id = ?';
  db.query(sql, [name, date, formattedTime, location, description, id], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar el evento:', err);
      res.status(500).json({ error: 'Error al actualizar el evento' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Evento no encontrado' });
    } else {
      res.json({ message: '✅ Evento actualizado correctamente' });
    }
  });
});

app.delete('/events/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM events WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar el evento:', err);
      res.status(500).json({ error: 'Error al eliminar el evento' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Evento no encontrado' });
    } else {
      res.json({ message: '✅ Evento eliminado correctamente' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
