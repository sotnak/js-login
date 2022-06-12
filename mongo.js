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
    if(found){
        client.close()
        throw Error('User already exists!')
    }

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

    client.close()

    if(!found.value)
        throw Error('Invalid nonce!')

    return found;
}

async function getUser(username){
    const {db, client} = openConnection()

    const user = await db.collection('users').findOne({username})

    client.close()

    if(!user)
        throw Error('User not found!')

    return user;
}

async function setAndClearTokens(username, jwt, refreshToken, RTValidUntil){
    const {db, client} = openConnection()

    await db.collection('tokens').deleteMany({username, RTValidUntil: {$lt: new Date(Date.now())}})
    await db.collection('tokens').insertOne({username, jwt, refreshToken, RTValidUntil})

    client.close()

    return true;
}

async function getTokens(username, refreshToken){
    const {db, client} = openConnection()

    const tokens = await db.collection('tokens').findOne({username, refreshToken})

    client.close()

    return tokens;
}

async function modifyTokens(username, jwt, refreshToken, RTValidUntil){
    const {db, client} = openConnection()

    await db.collection('tokens').findOneAndUpdate({username}, {$set: {jwt, refreshToken, RTValidUntil}})

    client.close()

    return true;
}

async function findAndDeleteAllTokens(username){
    const {db, client} = openConnection()

    const res = await db.collection('tokens').find({username}).toArray()
    await db.collection('tokens').deleteMany({username})

    client.close()

    return res;
}

async function addRevokedToken(token, validUntil){
    const {db, client} = openConnection()

    await db.collection('revokedTokens').insertOne({token, validUntil})

    client.close()

    return true;
}

async function addRevokedTokens(tokens){
    const {db, client} = openConnection()

    const toInsert = tokens.map(elem=>({token: elem.token, validUntil: elem.validUntil}))

    await db.collection('revokedTokens').insertMany(toInsert);

    client.close()

    return true;
}

async function findRevoked(token){
    const {db, client} = openConnection()

    const found = await db.collection('revokedTokens').findOne({token})

    client.close()

    if(!found)
        return false;

    return true;
}

module.exports.register = register;
module.exports.findAndDeleteNonce = findAndDeleteNonce;
module.exports.setNonce = setNonce;
module.exports.getUser = getUser;
module.exports.setAndClearTokens =  setAndClearTokens;
module.exports.getTokens = getTokens;
module.exports.modifyTokens = modifyTokens;
module.exports.addRevokedToken = addRevokedToken;
module.exports.findRevoked = findRevoked;
module.exports.findAndDeleteAllTokens = findAndDeleteAllTokens;
module.exports.addRevokedTokens = addRevokedTokens;