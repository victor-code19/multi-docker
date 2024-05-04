const keys = require('./keys');
// const { connectRedis } = require('./utilities');

const express = require('express');
const redis = require('redis');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// configure middlewares
app.use(cors());
app.use(express.json());

// create redis client and connect to database
const redisClient = redis.createClient({ url: keys.redisURL });
const redisPublisher = redisClient.duplicate();

(async () => {
  await redisClient.connect();
  await redisPublisher.connect();
})();

// create publisher

// create PG pool
const pool = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

// connect to PG pool and create table
pool.on('connect', async (client) => {
  try {
    await client.query('CREATE TABLE IF NOT EXISTS values (number INT)');
  } catch (err) {
    console.log(err);
  }
});

pool.on('error', (err) => {
  console.error(err);
});

// Express routes
app.get('/', (req, res) => {
  res.send('Hi!');
});

app.get('/values/all', async (req, res) => {
  try {
    const values = await pool.query('SELECT * FROM values');
    res.send(values.rows);
  } catch (err) {
    console.error(`An error occurred while fetching data from the table: ${err}`);
  }
});

app.get('/values/current', async (req, res) => {
  try {
    const values = await redisClient.hGetAll('values');
    res.send(values);
  } catch (err) {
    console.error(err);
  }
});

app.post('/values', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  try {
    await pool.query('INSERT INTO values(number) VALUES($1)', [index]);
  } catch (err) {
    console.error(`An error occurred while adding data to the table: ${err}`);
  }

  try {
    await redisClient.hSet('values', index, 'Nothing yet!');
    await redisPublisher.publish('insert', index);
  } catch (err) {
    console.error(err);
  }

  res.send({ working: true });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
