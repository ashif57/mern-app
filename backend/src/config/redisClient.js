const Redis = require('ioredis');
const config = require('./config');
const logger = require('./logger');

const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  lazyConnect: true, // Don't connect immediately
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
    logger.info('Connected to Redis');
});

module.exports = redisClient;
