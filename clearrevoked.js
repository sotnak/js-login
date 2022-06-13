const { MongoClient } = require("mongodb");
const {environment} = require("./environment")

const url = "mongodb://"+environment.mongo_addr;
const client = new MongoClient(url);

async function run() {
    const db = client.db('login')

    const res = await db.collection('revokedTokens').deleteMany({validUntil:{$lt:new Date(Date.now())}})

    client.close()

    console.log(res);
  }
  run()