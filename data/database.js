const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config/.env' });

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

const getConnection = async () => {
  try {
    return await mysql.createConnection(dbConfig);
  } catch (error) {
    console.error('Erreur de connexion à la base de données :', error.message);
    throw error;
  }
};

const getById = async (table, id) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return rows[0];
  } finally {
    await connection.end();
  }
};

const getAll = async (table) => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.query(`SELECT * FROM ${table}`);
    return rows;
  } finally {
    await connection.end();
  }
};

const insertOne = async (table, data) => {
  const connection = await getConnection();
  try {
    const [result] = await connection.query(`INSERT INTO ${table} SET ?`, data);
    return result.insertId; 
  } finally {
    await connection.end();
  }
};

const insertMany = async (table, dataArray) => {
  const connection = await getConnection();
  try {
    const [result] = await connection.query(
      `INSERT INTO ${table} (${Object.keys(dataArray[0]).join(', ')}) VALUES ?`,
      [dataArray.map(Object.values)]
    );
    return result.insertId;
  } finally {
    await connection.end();
  }
};

const updateOne = async (table, id, data) => {
  const connection = await getConnection();
  try {
    const [result] = await connection.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id]);
    return result.affectedRows;
  } finally {
    await connection.end();
  }
};

const updateMany = async (table, dataArray) => {
  const connection = await getConnection();
  try {
    const promises = dataArray.map(({ id, ...data }) =>
      connection.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id])
    );
    const results = await Promise.all(promises);
    return results.map((result) => result[0].affectedRows);
  } finally {
    await connection.end();
  }
};

const deleteById = async (table, id) => {
  const connection = await getConnection();
  try {
    const [result] = await connection.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
    return result.affectedRows;
  } finally {
    await connection.end();
  }
};

const deleteManyByIds = async (table, ids) => {
  const connection = await getConnection();
  try {
    const [result] = await connection.query(`DELETE FROM ${table} WHERE id IN (?)`, [ids]);
    return result.affectedRows;
  } finally {
    await connection.end();
  }
};

module.exports = {
  getById,
  getAll,
  insertOne,
  insertMany,
  updateOne,
  updateMany,
  deleteById,
  deleteManyByIds,
};
