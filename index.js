const {register} = require('./components/register')
const {access} = require('./components/access')
const {refresh} = require('./components/refresh')
const {revokeAll} = require('./components/revoke')
const { getNonce, login } = require('./components/login')

'use strict';

const express = require('express')
const bp = require('body-parser')
const { application } = require('express')
const { environment } = require('./environment')
const app = express()
const port = 8080

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello, this is login app!')
})

app.get('/access', async (req, res) => {
    access(req.headers.authorization).then(()=>{
        res.sendStatus(200)
    }).catch((e)=>{
        res.status(401).send(e.message);
    })
})

app.get('/nonce', async (req, res) => {
    const nonce = await getNonce().catch(()=>{res.sendStatus(500)})

    res.send(nonce)
})

app.post('/register', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    register(username, password).then(()=>{
        res.sendStatus(200)
    }).catch((e)=>{
        res.status(400).send(e.message);
    })
})

app.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const nonce = req.body.nonce

    login(username, password, nonce).then((tokens)=>{
        res.send(tokens)
    }).catch((e)=>{
        res.status(400).send(e.message);
    })
})

app.post('/refresh', async (req, res) => {
    const username = req.body.username
    const refreshToken = req.body.refreshToken

    refresh(username, refreshToken).then((tokens)=>{
        res.send(tokens)
    }).catch((e)=>{
        res.status(400).send(e.message);
    })
})

app.post('/revoke', async (req, res) => {
    const jwt = req.body.jwt

    revokeAll(jwt).then(()=>{
        res.sendStatus(200)
    }).catch((e)=>{
        res.status(400).send(e.message);
    })
})

app.listen(port, () => {
  console.log(`Login app listening on port ${port}`)
  console.log(`Using mongo on ${environment.mongo_addr}`)
})