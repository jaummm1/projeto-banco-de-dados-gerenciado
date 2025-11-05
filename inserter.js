const { primaryPool, replicaPool } = require('./db');
require('dotenv').config();

const INTERVAL_MS = Number(process.env.INSERT_INTERVAL_MS || 500);
const GRUPO = process.env.GRUPO_NOME || 'grupo-exemplo';

let counter = 0;
async function doInsertAndSelects() {
  counter++;
  const descricao = `produto-${Date.now()}-${counter}`;
  const categoria = 'geral';
  const valor = (Math.random() * 100).toFixed(2);

  try {
    const [result] = await primaryPool.execute(
      'INSERT INTO produto (descricao, categoria, valor, criado_por) VALUES (?, ?, ?, ?)',
      [descricao, categoria, valor, GRUPO],
    );
    const insertId = result.insertId;
    const [insertedRows] = await primaryPool.execute('SELECT * FROM produto WHERE id = ?', [
      insertId,
    ]);
    console.log('INSERT persistido:', insertedRows[0]);

    console.log('Realizando selects individuais na réplica (10 ids anteriores):');
    let toDo = 10;
    let idToQuery = insertId;
    while (toDo > 0 && idToQuery > 0) {
      try {
        const [rows] = await replicaPool.execute('SELECT * FROM produto WHERE id = ?', [idToQuery]);
        console.log(
          `SELECT id=${idToQuery} ->`,
          rows.length ? rows[0] : 'não encontrado (replica ainda não sincronizada)',
        );
      } catch (err) {
        console.error('Erro no select replica:', err.message);
      }
      idToQuery--;
      toDo--;
    }
  } catch (err) {
    console.error('Erro no insert:', err.message);
  }
}

(async () => {
  console.log('Iniciando inserter. Intervalo (ms):', INTERVAL_MS);
  setInterval(doInsertAndSelects, INTERVAL_MS);
})();
