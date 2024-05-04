const keys = require('./keys');

const redis = require('redis');
const { fib } = require('./utilities');

const redisClient = redis.createClient({ url: keys.redisURL });
const subscriber = redisClient.duplicate();

// connectRedis(redisClient);

(async () => {
  await redisClient.connect();
  await subscriber.connect();

  await subscriber.subscribe('insert', async (message) => {
    await redisClient.hSet('values', message, fib(parseInt(message)));
  });
})();
