function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

async function connectRedis(client) {
  await client.connect();

  client.on('connect', () => console.log('Redis Client Connected'));
  client.on('error', (err) => console.log('Redis Client Connection Error', err));
}

module.exports = { fib, connectRedis };
