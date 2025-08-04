import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

let redisClient = null;

const connectRedis = async () => {
  try {
    if (process.env.REDIS_URL) {
      redisClient = new Redis(process.env.REDIS_URL);
    } else {
      redisClient = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
      });
    }

    redisClient.on('connect', () => {
      logger.info('Redis connected');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis connection error:', err);
    });

    redisClient.on('close', () => {
      logger.warn('Redis connection closed');
    });

    return redisClient;
  } catch (error) {
    logger.error('Redis connection error:', error);
    return null;
  }
};

// Cache utilities
export const cacheSet = async (key, value, ttl = 3600) => {
  try {
    if (!redisClient) return null;
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    await redisClient.setex(key, ttl, serializedValue);
    return true;
  } catch (error) {
    logger.error('Redis set error:', error);
    return null;
  }
};

export const cacheGet = async (key) => {
  try {
    if (!redisClient) return null;
    const value = await redisClient.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    logger.error('Redis get error:', error);
    return null;
  }
};

export const cacheDelete = async (key) => {
  try {
    if (!redisClient) return null;
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Redis delete error:', error);
    return null;
  }
};

export const cacheClear = async () => {
  try {
    if (!redisClient) return null;
    await redisClient.flushall();
    return true;
  } catch (error) {
    logger.error('Redis clear error:', error);
    return null;
  }
};

// Initialize Redis connection
connectRedis();

export default redisClient; 