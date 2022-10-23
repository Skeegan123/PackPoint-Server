const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemon = require('nodemon');
const ws = require('ws');

const app = express();

// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  socket.on('message', message => {
    console.log("" + message);
    socket.send(`Hello, you sent -> ${message}`);
  });
  socket.send(`Hi there, I'm a WebSocket server`);
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(3000);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});