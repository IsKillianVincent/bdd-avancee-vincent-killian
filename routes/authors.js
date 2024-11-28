const express = require('express');
const router = express.Router();
const db = require('../data/database');

router.get('/', async (req, res) => {
  try {
    const authors = await db.getAll('authors');
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des auteurs.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const author = await db.getById('authors', id);
    if (!author) {
      return res.status(404).json({ error: 'Auteur non trouvé.' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'auteur.' });
  }
});

router.get('/search/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const authors = await db.search('authors', ['first_name', 'last_name'], name);
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: 'Errer lors de la recherche des auteurs.' });
  }
});

router.post('/', async (req, res) => {
  const { first_name, last_name, email } = req.body;
  try {
    const newAuthorId = await db.insertOne('authors', { first_name, last_name, email });
    res.status(201).json({ id: newAuthorId });
  } catch (error) {
    res.status(500).json({ error: 'Errer lors de l\'ajout de l\'auteur.' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedRows = await db.updateOne('authors', id, data);
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Auteur non trouvé.' });
    }
    res.json({ message: 'Auteur mis à jour.' });
  } catch (error) {
    res.status(500).json({ error: 'Errer lors de la mise à jour de l\'auteur.' });
  }
});

module.exports = router;
