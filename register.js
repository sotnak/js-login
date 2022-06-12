const dbRegister = require('./mongo').register

async function register(username, password){

    await dbRegister(username, password)
    
    return true
}

module.exports.register = register