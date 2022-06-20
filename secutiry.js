const crypto = require('crypto');
const { setSecret, getSecret } = require('./redis');

setSecret( crypto.randomBytes(16).toString('hex') )

const jwtLifeSpan = 600000 // 10 min
const refreshTokenLifeSpan = 3600000 // 1 h

function genNonce(){
    return crypto.randomBytes(16).toString('hex');
}

function hashWithNonce(str, nonce=''){
    if(nonce.length > 1)
        return crypto.createHash('sha256').update(str + '.' + nonce).digest('hex');
    else
        throw Error('Empty nonce')
}

async function getJWT(payload){
    const header = {
      typ: 'JWT',
      alg: 'HS256'
    };

    const validUntil = new Date(Date.now() + jwtLifeSpan)

    payload.validUntil = validUntil

    const header64 = Buffer.from(JSON.stringify(header)).toString('base64');

    const payload64 = Buffer.from(JSON.stringify(payload)).toString('base64');

    let key = header64 + '.' + payload64;
    const secret = await getSecret()
    const signature = await getSignature(key, secret);
    const key64 = signature.digest('base64');

    const token = header64 + '.' +payload64 + '.' + key64
    return {token, validUntil};
}

async function getSignature(str){
    const secret = await getSecret()
    return crypto.createHmac('sha256', secret).update(str);
}

function getRefreshToken(){
    const validUntil = new Date(Date.now() + refreshTokenLifeSpan)
    const token = crypto.randomBytes(32).toString('hex');
    return {token, validUntil}
}



module.exports.genNonce = genNonce;
module.exports.hashWithNonce = hashWithNonce;
module.exports.getJWT = getJWT;
module.exports.getSignature = getSignature;
module.exports.getRefreshToken = getRefreshToken;