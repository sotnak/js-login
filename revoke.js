const { addRevokedToken } = require("./mongo")
const {access} = require('./access')

function getValidUntil(jwt){
    const str = Buffer.from(jwt.split('.')[1],'base64').toString('ascii')

    return JSON.parse(str).validUntil;
}

async function revoke(payload){
    const jwt = payload.jwt

    const validUntil = getValidUntil(jwt)

    await access(jwt)

    await addRevokedToken(jwt, new Date(Date.parse(validUntil)));

    return true;
}

module.exports.revoke = revoke;