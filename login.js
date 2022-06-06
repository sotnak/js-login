const crypto = require('crypto');

function gethash(str, nonce=''){
    const hash1 = crypto.createHash('sha256').update(str).digest('hex')
    if(nonce.length > 1)
        return crypto.createHash('sha256').update(hash1 + '.' + nonce).digest('hex');
    else
        return hash1;
}

function getJWT(payload, secret){
    const header = {
      typ: 'JWT',
      alg: 'HS256'
    };

    const header64 = Buffer.from(JSON.stringify(header)).toString('base64');

    const payload64 = Buffer.from(JSON.stringify(payload)).toString('base64');

    let key = header64 + '.' + payload64;
    const signature = crypto.createHmac('sha256', secret).update(key);
    const key64 = signature.digest('base64');

    const token = header64 + '.' +payload64 + '.' + key64
    const refreshtoken = crypto.randomBytes(32).toString('hex');
    return {token, refreshtoken};
}

const nonce = crypto.randomBytes(16).toString('hex');
console.log(gethash('hello world', nonce))

const secret = crypto.randomBytes(16).toString('hex');

const payload = {
  autDate: Date.now(),
  validUntil: Date.now()+2000,
  username: gethash('hello world')
};

console.log(getJWT(payload, secret))