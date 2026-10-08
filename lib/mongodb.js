import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    if (uri) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    } else {
      global._mongoClientPromise = Promise.resolve(null);
    }
  }
  clientPromise = global._mongoClientPromise;
} else {
  if (uri) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  } else {
    clientPromise = Promise.resolve(null);
  }
}

export default clientPromise;
