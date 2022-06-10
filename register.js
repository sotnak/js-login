const dbRegister = require('./mongo').register

async function register(payload){

    await dbRegister(payload.username, payload.password)
    
    return true
}

module.exports.register = register