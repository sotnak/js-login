const { findRevoked } = require("../mongo")
const { getSignature } = require("../secutiry")

function checkSignature(authHeader){

    const splited = authHeader.split('.')
    const headerAndPayload = splited.slice(0, 2).join('.')
    const signature = splited[2]

    const actualSignature = getSignature(headerAndPayload).digest('base64')

    if(signature != actualSignature)
        throw Error('Corrupted JWT')

    return true;
}

function checkDate(authHeader){
    const payload64 = authHeader.split('.')[1]
    const payload = JSON.parse(Buffer.from(payload64,'base64').toString('ascii'))

    if( Date.parse(payload.validUntil) < Date.now())
        throw Error('JWT is expired!')

    return true;
}

async function isRevoked(authHeader){
    return findRevoked(authHeader);
}

async function access(authHeader){
    checkSignature(authHeader)
    checkDate(authHeader)
    if(await isRevoked(authHeader))
        throw Error('JWT is revoked!')
}

module.exports.access = access