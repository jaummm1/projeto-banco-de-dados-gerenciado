const mysql = require('mysql2/promise');
require('dotenv').config();

const primaryPool = mysql.createPool({
  host: process.env.PRIMARY_HOST || 'localhost',
  port: Number(process.env.PRIMARY_PORT || 3306),
  user: process.env.PRIMARY_USER || 'root',
  password: process.env.PRIMARY_PASSWORD || '',
  database: process.env.PRIMARY_DB || 'aula-db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const replicaPool = mysql.createPool({
  host: process.env.REPLICA_HOST || process.env.PRIMARY_HOST || 'localhost',
  port: Number(process.env.REPLICA_PORT || process.env.PRIMARY_PORT || 3306),
  user: process.env.REPLICA_USER || process.env.PRIMARY_USER || 'root',
  password: process.env.REPLICA_PASSWORD || process.env.PRIMARY_PASSWORD || '',
  database: process.env.REPLICA_DB || process.env.PRIMARY_DB || 'aula-db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = { primaryPool, replicaPool };
