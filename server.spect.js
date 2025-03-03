import request from 'supertest';
import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

jest.mock('mysql2');
const mockQuery = jest.fn();
mysql.createConnection.mockReturnValue({
  query: mockQuery,
  connect: jest.fn(),
});

app.get('/events', (req, res) => {
  const sql = 'SELECT * FROM events';
  mockQuery(sql, (err, results) => {
    if (err) {
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

app.post('/events', (req, res) => {
  const { name, date, time, location, description } = req.body;
  const formattedTime = time.length === 5 ? `${time}:00` : time;

  const sql = 'INSERT INTO events (name, date, time, location, description) VALUES (?, ?, ?, ?, ?)';
  mockQuery(sql, [name, date, formattedTime, location, description], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al guardar el evento' });
    } else {
      res.status(201).json({ message: 'Evento guardado correctamente', id: result.insertId });
    }
  });
});

describe('GET /events', () => {
  it('debería devolver una lista de eventos', async () => {
    const mockResults = [{ id: 1, name: 'Evento 1', date: '2025-03-01', time: '10:00', location: 'Lugar 1', description: 'Descripción 1' }];
    mockQuery.mockImplementationOnce((sql, callback) => callback(null, mockResults));

    const response = await request(app).get('/events');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResults.map(event => ({
      ...event,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time.substring(0, 5),
    })));
  });

  it('debería manejar el error al obtener los eventos', async () => {
    mockQuery.mockImplementationOnce((sql, callback) => callback(new Error('Error al obtener eventos'), null));

    const response = await request(app).get('/events');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error al obtener eventos' });
  });
});


describe('POST /events', () => {
  it('debería crear un nuevo evento', async () => {
    const newEvent = {
      name: 'Nuevo Evento',
      date: '2025-03-10',
      time: '15:30',
      location: 'Nuevo Lugar',
      description: 'Nueva Descripción',
    };
    const mockInsertId = 1;
    mockQuery.mockImplementationOnce((sql, params, callback) => callback(null, { insertId: mockInsertId }));

    const response = await request(app)
      .post('/events')
      .send(newEvent);
    
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Evento guardado correctamente', id: mockInsertId });
  });

  it('debería manejar el error al guardar un evento', async () => {
    const newEvent = {
      name: 'Nuevo Evento',
      date: '2025-03-10',
      time: '15:30',
      location: 'Nuevo Lugar',
      description: 'Nueva Descripción',
    };
    mockQuery.mockImplementationOnce((sql, params, callback) => callback(new Error('Error al guardar el evento'), null));

    const response = await request(app)
      .post('/events')
      .send(newEvent);
    
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error al guardar el evento' });
  });
});
