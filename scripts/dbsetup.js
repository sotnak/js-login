const { MongoClient } = require("mongodb");
const {environment} = require("../environment")

const url = "mongodb://"+environment.mongo_addr
const client = new MongoClient(url);

async function run() {
    const db = client.db('login')

    const fetchedColls = await db.collections()
    const existingColls = []

    for(const coll of fetchedColls){
        existingColls.push(coll.s.namespace.collection)
    }

    const toCreate = [
        'users',
        'tokens',
        'revokedTokens',
        'nonces'
    ]

    for(const coll of toCreate){
        if(existingColls.includes(coll)){
            await db.dropCollection(coll)
        }

        await db.createCollection(coll)
    }

    await db.collection('users').createIndex({username:1})
    await db.collection('tokens').createIndex({username:1})
    await db.collection('revokedTokens').createIndex({token:1})
    await db.collection('nonce').createIndex({nonce:1})

    client.close()
  }
  run()