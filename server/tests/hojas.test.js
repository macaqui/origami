import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/db.js';

// Pruebas de integración: requieren MySQL/MariaDB en ejecución
// con la base de datos creada por server/database.sql.
// El acceso a datos pasa por Prisma (ver prisma/schema.prisma).

let idCreado;

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Origami API', () => {
  it('GET /api/health responde con estado OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('OK');
    expect(res.body.proyecto).toBe('Origami API');
  });

  it('GET /api/hojas devuelve un arreglo', async () => {
    const res = await request(app).get('/api/hojas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/hojas rechaza campos vacíos con 400', async () => {
    const res = await request(app).post('/api/hojas').send({ titulo: '  ', contenido: '' });
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/obligatorios/i);
  });

  it('POST /api/hojas crea una hoja válida (201)', async () => {
    const res = await request(app).post('/api/hojas').send({
      titulo: 'Prueba automatizada',
      contenido: 'Creada por vitest + supertest',
      categoria: 'Base de Datos',
      prioridad: 'Alta'
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeTypeOf('number');
    expect(res.body.plegada).toBe(false);
    idCreado = res.body.id;
  });

  it('GET /api/hojas/:id devuelve la hoja creada', async () => {
    const res = await request(app).get(`/api/hojas/${idCreado}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(idCreado);
  });

  it('PUT /api/hojas/:id pliega la hoja', async () => {
    const res = await request(app).put(`/api/hojas/${idCreado}`).send({
      titulo: 'Prueba automatizada',
      contenido: 'Creada por vitest + supertest',
      categoria: 'Base de Datos',
      prioridad: 'Alta',
      plegada: true
    });

    expect(res.status).toBe(200);
    expect(res.body.plegada).toBe(true);
  });

  it('PUT /api/hojas/:id sin "plegada" conserva el estado actual', async () => {
    const res = await request(app).put(`/api/hojas/${idCreado}`).send({
      titulo: 'Prueba automatizada v2',
      contenido: 'No debe desplegarse',
      categoria: 'Estudio',
      prioridad: 'Baja'
    });

    expect(res.status).toBe(200);
    expect(res.body.plegada).toBe(true);
  });

  it('PUT /api/hojas/:id con id inexistente devuelve 404', async () => {
    const res = await request(app)
      .put('/api/hojas/999999')
      .send({ titulo: 'x', contenido: 'y' });
    expect(res.status).toBe(404);
  });

  it('DELETE /api/hojas/:id elimina la hoja creada', async () => {
    const res = await request(app).delete(`/api/hojas/${idCreado}`);
    expect(res.status).toBe(200);
    expect(res.body.mensaje).toMatch(/eliminada/i);
  });

  it('DELETE /api/hojas/:id con id inexistente devuelve 404', async () => {
    const res = await request(app).delete('/api/hojas/999999');
    expect(res.status).toBe(404);
  });

  it('una ruta inexistente devuelve 404 en JSON', async () => {
    const res = await request(app).get('/api/no-existe');
    expect(res.status).toBe(404);
    expect(res.body.mensaje).toMatch(/no encontrada/i);
  });
});
