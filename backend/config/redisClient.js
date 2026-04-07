const { createClient } = require('redis');

// In-Memory Fallback Map
const memoryStore = new Map();

class FallbackRedis {
    async get(key) { return memoryStore.get(key) || null; }
    async set(key, value, options) { memoryStore.set(key, value); }
    async del(key) { memoryStore.delete(key); }
    async incr(key) { 
        const val = (parseInt(memoryStore.get(key)) || 0) + 1;
        memoryStore.set(key, val.toString());
        return val;
    }
    async expire(key, seconds) { /* dummy */ }
    async connect() { console.log('Using In-Memory Fallback Redis'); }
}

let client;
try {
    if (process.env.REDIS_URL) {
        client = createClient({ url: process.env.REDIS_URL });
        client.on("error", (err) => {
            console.log("Redis Connection Error, falling back to Memory");
            client = new FallbackRedis();
        });
        client.connect().then(() => console.log("Real Redis Connected")).catch(() => {
            client = new FallbackRedis();
        });
    } else {
        client = new FallbackRedis();
        client.connect();
    }
} catch (e) {
    client = new FallbackRedis();
}

module.exports = client;