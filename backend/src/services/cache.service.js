const redisClient = require('../config/redisClient');

/**
 * Cache data in Redis
 * @param {string} key
 * @param {Object|string} value
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<void>}
 */
const setCache = async (key, value, ttl = 3600) => {
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
  if (ttl) {
    await redisClient.set(key, stringValue, 'EX', ttl);
  } else {
    await redisClient.set(key, stringValue);
  }
};

/**
 * Get cached data from Redis
 * @param {string} key
 * @returns {Promise<Object|string|null>}
 */
const getCache = async (key) => {
  const data = await redisClient.get(key);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
};

/**
 * Delete cached data from Redis
 * @param {string} key
 * @returns {Promise<void>}
 */
const deleteCache = async (key) => {
  await redisClient.del(key);
};

module.exports = {
  setCache,
  getCache,
  deleteCache,
};
