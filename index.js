const {register} = require('./register')
const {access} = require('./access')
const {refresh} = require('./refresh')
const {revoke} = require('./revoke')
const { getNonce, login } = require('./login')

const express = require('express')
const bp = require('body-parser')
const { application } = require('express')
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
    register(req.body).then(()=>{
        res.sendStatus(200)
    }).catch((e)=>{
        res.status(400).send(e.message);
    })
})

app.post('/login', async (req, res) => {
    login(req.body).then((tokens)=>{
        res.send(tokens)
    }).catch((e)=>{
        res.status(400).send(e.message);
    })
})

app.post('/refresh', async (req, res) => {
    refresh(req.body).then((tokens)=>{
        res.send(tokens)
    }).catch((e)=>{
        res.status(400).send(e.message);
    })
})

app.post('/revoke', async (req, res) => {
    revoke(req.body).then(()=>{
        res.sendStatus(200)
    }).catch((e)=>{
        res.status(400).send(e.message);
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})