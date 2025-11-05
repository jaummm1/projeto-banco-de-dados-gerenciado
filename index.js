const express = require('express');
const bodyParser = require('body-parser');
const { primaryPool, replicaPool } = require('./db');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const GRUPO = process.env.GRUPO_NOME || 'grupo-exemplo';

app.post('/produtos', async (req, res) => {
  const { descricao, categoria, valor } = req.body;
  if (!descricao || !categoria || valor == null) {
    return res.status(400).json({ error: 'descricao, categoria e valor são obrigatórios' });
  }
  try {
    const [result] = await primaryPool.execute(
      'INSERT INTO produto (descricao, categoria, valor, criado_por) VALUES (?, ?, ?, ?)',
      [descricao, categoria, valor, GRUPO],
    );
    const insertId = result.insertId;
    const [rows] = await primaryPool.execute('SELECT * FROM produto WHERE id = ?', [insertId]);
    res.status(201).json({ id: insertId, produto: rows[0] });
  } catch (err) {
    console.error('Erro no insert:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/produtos/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'id inválido' });
  try {
    const [rows] = await replicaPool.execute('SELECT * FROM produto WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'produto não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Erro no select (replica):', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
  console.log('POST /produtos -> write (primary)');
  console.log('GET  /produtos/:id -> read  (replica)');
});
