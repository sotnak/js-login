const { addRevokedToken, findAndDeleteAllTokens, addRevokedTokens } = require("../mongo")
const {access} = require('./access')

function getPayload(jwt){
    const str = Buffer.from(jwt.split('.')[1],'base64').toString('ascii')

    return JSON.parse(str);
}

async function revoke(jwt){

    const {validUntil} = getPayload(jwt)

    await access(jwt)

    await addRevokedToken(jwt, new Date(Date.parse(validUntil)));

    return true;
}

async function revokeAll(jwt){

    const {validUntil, username} = getPayload(jwt)

    await access(jwt)
    
    const tokens = await findAndDeleteAllTokens(username)

    const toRevoke = tokens.map(elem => ({token: elem.jwt, validUntil: getPayload(elem.jwt).validUntil}))

    await addRevokedTokens(toRevoke)

    return true;
}

module.exports.revoke = revoke;
module.exports.revokeAll = revokeAll;