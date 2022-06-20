const {getUser, setAndClearTokens} = require('../mongo')
const {setNonce, deleteNonce} = require('../redis')
const {genNonce, getJWT, getRefreshToken, hashWithNonce} = require('../secutiry')

async function getNonce(){
    const nonce = genNonce()
    console.log(hashWithNonce('password', nonce));
    await setNonce(nonce)
    return nonce;
}

async function login(username, password, nonce){

    if(!nonce || !username || !password)
        throw Error('Invalid credentials!');

    await deleteNonce(nonce)

    const actualUser = await getUser(username)
    const actualPassword = actualUser.password;

    if(password != hashWithNonce(actualPassword, nonce))
        throw Error('Wrong password!')
    
    const jwt = await getJWT({username})
    const refreshToken = getRefreshToken()

    await setAndClearTokens(username, jwt.token, refreshToken.token, refreshToken.validUntil)

    return {
        jwt: jwt.token,
        JWTValidUntil: jwt.validUntil.toISOString(),
        refreshToken: refreshToken.token,
        RTValidUntil: refreshToken.validUntil.toISOString()
    };
}

module.exports.getNonce = getNonce;
module.exports.login = login;