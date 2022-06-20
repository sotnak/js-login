const {createClient} = require('redis');
const {environment} = require('./environment');

async function openConnection(){
    const client = createClient({
        url: `redis://${environment.redis_addr}`
      });

    await client.connect();

    return client;
}

async function setNonce(nonce){
    const client = await openConnection()

    await client.hSet('nonces', nonce, 'in use')

    client.quit()

    return true;
}

async function deleteNonce(nonce){
    const client = await openConnection()

    await client.hDel('nonces', nonce).catch(()=>{
        client.quit()
        throw Error('Nonce is invalid!')
    })

    client.quit()

    return true;
}

async function setSecret(secret){
    const client = await openConnection()

    await client.set('secret', secret)

    client.quit()

    return true;
}

async function getSecret(){
    const client = await openConnection()

    const secret = await client.get('secret')

    client.quit()

    return secret;
}

module.exports.setNonce = setNonce
module.exports.deleteNonce = deleteNonce
module.exports.setSecret = setSecret
module.exports.getSecret = getSecret