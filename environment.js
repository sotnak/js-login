require('dotenv').config()

const environment = {
    mongo_addr: process.env.mongo_addr,
    redis_addr: process.env.redis_addr
}

module.exports.environment = environment