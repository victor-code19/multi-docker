async function connectRedis(client) {
  await client.connect();

  client.on('connect', () => console.log('Redis Client Connected'));
  client.on('error', (err) => console.log('Redis Client Connection Error', err));
}

module.exports = { connectRedis };
