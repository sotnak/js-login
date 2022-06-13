const { MongoClient } = require("mongodb");
const {environment} = require("../environment")

const url = "mongodb://"+environment.mongo_addr
const client = new MongoClient(url);

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

        console.log(await db.createCollection(coll))
    }

    console.log(await db.collection('users').createIndex({username:1}))
    console.log(await db.collection('tokens').createIndex({username:1}))
    console.log(await db.collection('revokedTokens').createIndex({token:1}))
    console.log(await db.collection('nonce').createIndex({nonce:1}))

    client.close()
}
  
rl.question('Are you sure? All data will be erased! Type \'yes\' to continue.\n', (answer) => {
    if(answer == 'yes')
        run()
    rl.close();
});