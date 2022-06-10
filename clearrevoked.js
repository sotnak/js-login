const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017"
const client = new MongoClient(url);

async function run() {
    const db = client.db('login')

    const res = await db.collection('revokedTokens').deleteMany({validUntil:{$lt:new Date(Date.now())}})

    client.close()

    console.log(res);
  }
  run()