const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017"

function openConnection(){
    const client = new MongoClient(url);
    const db = client.db('login')
    return {db, client};
}

async function register(username, password){
    const {db, client} = openConnection()

    const found = await db.collection('users').findOne({username})
    if(found)
        throw Error('User already exists!')

    await db.collection('users').insertOne({username, password})

    client.close()

    return true;
}

async function setNonce(nonce){
    const {db, client} = openConnection()

    await db.collection('nonces').insertOne({nonce})

    client.close()

    return true;
}

async function findAndDeleteNonce(nonce){
    const {db, client} = openConnection()

    const found = await db.collection('nonces').findOneAndDelete({nonce})

    if(!found.value)
        throw Error('Invalid nonce!')

    client.close()

    return true;
}

async function getUser(username){
    const {db, client} = openConnection()

    const user = await db.collection('users').findOne({username})

    if(!user)
        throw Error('User not found!')

    client.close()

    return user;
}

async function setTokens(username, jwt, refreshToken, RTValidUntil){
    const {db, client} = openConnection()

    await db.collection('tokens').deleteMany({username})
    await db.collection('tokens').insertOne({username, jwt, refreshToken, RTValidUntil})

    client.close()

    return true;
}

async function getTokens(username){
    const {db, client} = openConnection()

    const tokens = await db.collection('tokens').findOne({username})

    client.close()

    return tokens;
}

async function modifyTokens(username, jwt, refreshToken, RTValidUntil){
    const {db, client} = openConnection()

    await db.collection('tokens').findOneAndUpdate({username}, {$set: {jwt, refreshToken, RTValidUntil}})

    client.close()

    return true;
}

async function addRevokedToken(token, validUntil){
    const {db, client} = openConnection()

    await db.collection('revokedTokens').insertOne({token, validUntil})

    client.close()

    return true;
}

async function findRevoked(token){
    const {db, client} = openConnection()

    const found = await db.collection('revokedTokens').findOne({token})

    if(!found)
        return false;

    client.close()

    return true;
}

module.exports.register = register;
module.exports.findAndDeleteNonce = findAndDeleteNonce;
module.exports.setNonce = setNonce;
module.exports.getUser = getUser;
module.exports.setTokens =  setTokens;
module.exports.getTokens = getTokens;
module.exports.modifyTokens = modifyTokens;
module.exports.addRevokedToken = addRevokedToken;
module.exports.findRevoked = findRevoked;