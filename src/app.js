const db = require('../data/database');

(async () => {
  try {

    const author = await db.getById('authors', 1);
    console.log('Auteur 1 :', author);

    const authors = await db.getAll('authors');
    console.log('Tous les auteurs :', authors);

    const newAuthorId = await db.insertOne('authors', {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
      birthdate: '1990-01-01',
    });
    console.log('Nouvel auteur inséré avec ID :', newAuthorId);

    const newAuthorsData = [
      { first_name: 'John', last_name: 'Smith', email: 'john.smith@example.com', birthdate: '1980-05-15' },
      { first_name: 'Alice', last_name: 'Brown', email: 'alice.brown@example.com', birthdate: '1985-07-20' },
    ];
    const newAuthorsId = await db.insertMany('authors', newAuthorsData);
    console.log('Nouveaux auteurs insérés avec IDs :', newAuthorsId);

    const updateData = [
      { id: newAuthorsId[0], email: 'john.updated@example.com' },
      { id: newAuthorsId[1], email: 'alice.updated@example.com' },
    ];
    const updatedRows = await db.updateMany('authors', updateData);
    console.log('Nombre d\'auteurs mis à jour :', updatedRows);

    const deletedRows = await db.deleteManyByIds('authors', newAuthorsId);
    console.log(`Nombre d'auteurs supprimés : ${deletedRows}`);

  } catch (error) {
    console.error('Erreur lors de l\'exécution :', error.message);
  }
})();
