const express = require('express');
const bodyParser = require('body-parser');
const authorsRoute = require('../routes/authors');
const postsRoute = require('../routes/posts');

const app = express();

app.use(bodyParser.json());

app.use('/authors', authorsRoute);
app.use('/posts', postsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
