const redis = require('redis');
require('dotenv').config();


const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});


redisClient.on('connect', () => console.log(' Redis Client Connected!'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error("Could not connect to Redis:", error);
    }
};

module.exports = { redisClient, connectRedis };