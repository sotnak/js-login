const { getTokens, modifyTokens } = require("./mongo")
const { revoke } = require("./revoke")
const {getJWT, getRefreshToken} = require('./secutiry')

async function refresh(username, refreshToken){

    const tokens = await getTokens(username, refreshToken)

    if(!tokens)
        throw Error('Invalid refresh token!')

    if(tokens.RTValidUntil < new Date(Date.now()))
        throw Error('Refresh token is expired!')

    try{
        await revoke(tokens.jwt)
    }catch(e){
        //token is already invalid
    }

    const jwt = getJWT({username})
    const RT = getRefreshToken()

    await modifyTokens(username, jwt.token, RT.token, RT.validUntil)

    return {
        JWT: jwt.token,
        JWTValidUntil: jwt.validUntil.toISOString(),
        refreshToken: RT.token,
        RTValidUntil: RT.validUntil.toISOString()
    };
}

module.exports.refresh = refresh;