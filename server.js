const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemon = require('nodemon');
const ws = require('ws');
const port = 3000;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res)=>{
    res.send("Welcome to your server");
})

app.post('/index', (req, res)=>{
    console.log(req.body.username);
    console.log(req.body.password);
});

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', (socket) => {
    socket.on('message', (message) => console.log(message));
});


const server = app.listen(3000);
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (socket) => {
        wsServer.emit('connection', socket, request);
    });
});