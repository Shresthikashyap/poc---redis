const { createClient  } = require('redis');

async function createRedisClient() {
  // read the Redis connection URL from the envs
  let redisURL = 'redis://127.0.0.1:6379'//process.env.REDIS_URI
  // let redisURL = 'redis://default:4gn3lJxCpE2YxFTEGfH9lb6dQ8qXlWKJ@stranger-extraordinary-microneat-19787.db.redis.io:11384'
  let redisClient;

  if (redisURL) {
    // create the Redis client object
    redisClient = createClient({ url: redisURL }).on("error", (e) => {
      console.error(`Failed to create the Redis client with error:`);
      console.error(e);
    });

    try {
      // connect to the Redis server
      await redisClient.connect();
      console.log(`Connected to Redis successfully!`);
      return redisClient;
    } catch (e) {
      console.error(`Connection to Redis failed with error:`);
      console.error(e);
    }
  }
}

module.exports = { createRedisClient };

//createRedisClient is used to create a new Redis client instance for different roles (plain commands, pub/sub, queue processing) to avoid conflicts since a client in subscribe mode cannot run normal commands.
