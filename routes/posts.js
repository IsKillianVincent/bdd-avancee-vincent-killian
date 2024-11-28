const express = require('express');
const router = express.Router();
const db = require('../data/database');

router.get('/', async (req, res) => {
  try {
    const posts = await db.getAll('posts');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des posts.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await db.getById('posts', id);
    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé.' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du post.' });
  }
});

router.get('/search/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const posts = await db.search('posts', ['title'], title);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la recherche des posts.' });
  }
});

router.post('/', async (req, res) => {
  const { title, content, author_id } = req.body;
  try {
    const newPostId = await db.insertOne('posts', { title, content, author_id });
    res.status(201).json({ id: newPostId });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du post.' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedRows = await db.updateOne('posts', id, data);
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Post non trouvé.' });
    }
    res.json({ message: 'Post mis à jour.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du post.' });
  }
});

module.exports = router;
