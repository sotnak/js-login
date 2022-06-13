require('dotenv').config()

const environment = {
    mongo_addr: process.env.mongo_addr
}

module.exports.environment = environment