require('dotenv').config({ path: './config/.env' });
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

(async () => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connexion à la base de données réussie.');

    const [rows] = await connection.query('SELECT * FROM authors');
    console.log('Liste des auteurs :', rows);

    const [lastPost] = await connection.query('CALL last_post_from_author(1)');
    console.log('Dernier post de l\'auteur 1 :', lastPost[0]);

    const [results] = await connection.query('CALL is_top_author(1, @is_top)');
    const [[isTopAuthor]] = await connection.query('SELECT @is_top AS is_top');
    console.log('Est-ce un auteur prolifique (1) ? :', isTopAuthor.is_top);

  } catch (error) {
    console.error('Erreur de connexion ou d\'exécution SQL :', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connexion à la base de données fermée.');
    }
  }
})();
