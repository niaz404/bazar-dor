import { MongoClient } from 'mongodb';

const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};

let cachedClient = null;

export async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('username:pass')) {
    return null;
  }

  try {
    if (cachedClient) {
      return cachedClient;
    }
    const client = new MongoClient(uri, options);
    await client.connect();
    cachedClient = client;
    return cachedClient;
  } catch (err) {
    cachedClient = null;
    throw err;
  }
}

let clientPromise = (async () => {
  try {
    return await getMongoClient();
  } catch {
    return null;
  }
})();

export default clientPromise;

