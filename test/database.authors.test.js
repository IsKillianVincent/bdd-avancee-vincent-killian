const { getAll, getById, insertOne, updateOne, deleteOne, search, pool } = require('../data/database');

let newAuthorId;

beforeAll(async () => {
  // console.log(pool);

  await pool.query("DELETE FROM authors WHERE email = ?", ["john.doe@example.com"]);
  await pool.query("DELETE FROM authors WHERE email = ?", ["test.author@example.com"]);

  const [result] = await pool.query(
    "INSERT INTO authors (first_name, last_name, email, birthdate) VALUES (?, ?, ?, ?)",
    ["Test", "Author", "test.author@example.com", "1990-01-01"]
  );
  newAuthorId = result.insertId;
});

afterAll(async () => {
  await pool.query("DELETE FROM authors WHERE email = ?", ["test.author@example.com"]);
  await pool.end();
});

test("getAll() returns a list of elements", async () => {
  const authors = await getAll("authors");
  expect(Array.isArray(authors)).toBe(true);
  expect(authors.length).toBeGreaterThan(0);
});

test("getById() returns details of an item with a valid ID", async () => {
  const author = await getById("authors", newAuthorId);
  expect(author).toBeDefined();
  expect(author).toMatchObject({
    first_name: "Test",
    last_name: "Author",
    email: "test.author@example.com",
  });
});

test("insertOne() insère un élément et retourne son ID", async () => {
  const newAuthor = {
    first_name: "John",
    last_name: "Doe",
    email: `john.doe.${Date.now()}@example.com`,
    birthdate: "1990-01-01",
  };

  const insertedId = await insertOne("authors", newAuthor);
  expect(insertedId).toBeGreaterThan(0);

  const insertedAuthor = await getById("authors", insertedId);
  // Je deteste les fuseaux horaires!!!
  const normalizedInsertedDate = new Date(insertedAuthor.birthdate + ' UTC').toISOString().split('T')[0];
  const normalizedTestDate = new Date(newAuthor.birthdate + ' UTC').toISOString().split('T')[0];

  expect(insertedAuthor).toMatchObject({
    first_name: newAuthor.first_name,
    last_name: newAuthor.last_name,
    email: newAuthor.email,
  });

  expect(normalizedInsertedDate).toBe(normalizedTestDate);

  await deleteOne("authors", insertedId);
});


test("updateOne() updates an existing item", async () => {
  const updatedData = { first_name: "Updated", last_name: "Name" };

  const affectedRows = await updateOne("authors", newAuthorId, updatedData);
  expect(affectedRows).toBe(1);

  const updatedAuthor = await getById("authors", newAuthorId);
  expect(updatedAuthor).toMatchObject(updatedData);
});

test("deleteOne() deletes an existing item", async () => {
  const tempAuthor = {
    first_name: "Temp",
    last_name: "User",
    email: "temp.user@example.com",
    birthdate: "1985-01-01",
  };

  const tempId = await insertOne("authors", tempAuthor);

  const deletedRows = await deleteOne("authors", tempId);
  expect(deletedRows).toBe(1);

  const deletedAuthor = await getById("authors", tempId);
  expect(deletedAuthor).toBeUndefined();
});

test("search() returns items matching the search term", async () => {
  const newAuthor = {
    first_name: "Test",
    last_name: "User",
    email: "test.user@example.com",
    birthdate: "1990-01-01",
  };

  const insertedId = await insertOne("authors", newAuthor);

  const searchResults = await search("authors", ["first_name", "last_name"], "Test");
  expect(searchResults.length).toBeGreaterThan(0);
  expect(searchResults[0]).toHaveProperty("first_name", "Test");
  
  await deleteOne("authors", insertedId);
});
