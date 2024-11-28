const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config/.env' });

// !! Découverte !!
/**
    Création d'un pool de connexions à la base de données
    Un pool permet de gérer plusieurs connexions simultanées à la base de données de manière efficace,
    en réutilisant des connexions existantes au lieu de créer une nouvelle connexion à chaque requête,
    ce qui améliore les performances et réduit les coûts associés à la gestion des connexions.
**/
// https://adi22maurya.medium.com/mysql-createconnection-vs-mysql-createpool-in-node-js-42a5274626e7
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function getAll(tableName) {
  try {
    const [rows] = await pool.query(`SELECT * FROM ??`, [tableName]);
    return rows;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données de ${tableName}:`, error.message);
    throw error;
  }
}

async function getById(tableName, id) {
  try {
    const [rows] = await pool.query(`SELECT * FROM ?? WHERE id = ?`, [tableName, id]);
    return rows[0];
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'élément avec ID ${id} de ${tableName}:`, error.message);
    throw error;
  }
}

async function insertOne(tableName, data) {
  try {
    const [result] = await pool.query(`INSERT INTO ?? SET ?`, [tableName, data]);
    return result.insertId;
  } catch (error) {
    console.error(`Erreur lors de l'insertion dans ${tableName}:`, error.message);
    throw error;
  }
}

async function updateOne(tableName, id, data) {
  try {
    const [result] = await pool.query(`UPDATE ?? SET ? WHERE id = ?`, [tableName, data, id]);
    return result.affectedRows;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'élément avec ID ${id} dans ${tableName}:`, error.message);
    throw error;
  }
}

async function deleteOne(tableName, id) {
  try {
    const [result] = await pool.query(`DELETE FROM ?? WHERE id = ?`, [tableName, id]);
    return result.affectedRows;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'élément avec ID ${id} dans ${tableName}:`, error.message);
    throw error;
  }
}

async function search(tableName, columnNames, searchTerm) {
    try {
      const searchQuery = columnNames
        .map(column => `${column} LIKE ?`)
        .join(' OR ');
  
      const searchValues = columnNames.map(() => `%${searchTerm}%`);
      const [rows] = await pool.query(
        `SELECT * FROM ?? WHERE ${searchQuery}`,
        [tableName, ...searchValues]
      );
  
      return rows;
    } catch (error) {
      console.error(`Erreur lors de la recherche dans ${tableName}:`, error.message);
      throw error;
    }
  }
  

module.exports = {
  getAll,
  getById,
  insertOne,
  updateOne,
  deleteOne,
  search,
};
