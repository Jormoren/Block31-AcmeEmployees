// imports here for express and pg
const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_hr_db');

// static routes here (you only need these for deployment)
app.use(express.static(path.join(__dirname, '../client/dist')));

// app routes here
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.get('/api/employees', async (req, res, next) => {
  try {
    const SQL = `SELECT * FROM employees;`;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

// create your init function
const init = async () => {
  try {
    await client.connect();
    const SQL = `
      DROP TABLE IF EXISTS employees;
      CREATE TABLE employees(
        id SERIAL PRIMARY KEY,
        txt VARCHAR(50),
        is_admin BOOLEAN DEFAULT FALSE
      );
      INSERT INTO employees(txt, is_admin) VALUES('name', false);
    `;
    await client.query(SQL);
    console.log('Data seeded');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.end(); // Close the connection
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`));
};

// init function invocation
init();
