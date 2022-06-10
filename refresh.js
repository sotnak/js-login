const { getTokens, modifyTokens } = require("./mongo")
const { revoke } = require("./revoke")
const {getJWT, getRefreshToken} = require('./secutiry')

async function refresh(payload){
    const username = payload.username
    const RT = payload.refreshToken

    const tokens = await getTokens(username)

    if(!tokens || tokens.refreshToken != RT)
        throw Error('Invalid refresh token!')

    try{
        await revoke({jwt:tokens.jwt})
    }catch(e){
        //token is already invalid
    }

    const jwt = getJWT({username})
    const refreshToken = getRefreshToken()

    await modifyTokens(username, jwt.token, refreshToken.token, refreshToken.validUntil)

    return {
        JWT: jwt.token,
        JWTValidUntil: jwt.validUntil.toISOString(),
        refreshToken: refreshToken.token,
        RTValidUntil: refreshToken.validUntil.toISOString()
    };
}

module.exports.refresh = refresh;