const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemon = require('nodemon');
const ws = require('ws');
const db = require('./queries');
const fs = require('fs');

const app = express();

const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'api',
  password: '***REMOVED***',
  port: 5432,
});

app.use(bodyParser.json());

app.use(cors());

pool.connect((err, client, release) => {
  if (err) {
      return console.error(
          'Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
      release()
      if (err) {
          return console.error(
              'Error executing query', err.stack)
      }
      console.log("Connected to Database !")
  })
})

// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
    socket.on('message', message => {
      if (("" + message) === 'load') {
        console.log('Loading posts');
        pool.query('SELECT * FROM posts ORDER BY postID ASC;', (error, results) => {
          if (error) {
            throw error
          }
        //   response.status(200).json(results.rows)
        socket.send(JSON.stringify(results.rows));
        });
      } else {
      // console.log("" + message);
      let post = JSON.parse(message);
      let postObject = {
        userID: 1,
        coordinates: ( '(' + parseFloat(post.latitude) + ',' + parseFloat(post.longitude) +')' ),
        description: post.locationDescription,
        noise: post.noiseLevel,
        crowd: post.crowdLevel,
        idreq: post.IDrequired,
        wifi: post.wifi,
        amenities: post.amenities,
        tags: post.tags,
        title: post.locationName,
      }
      db.createPost(JSON.stringify(postObject));
      socket.send(`Hello, you sent -> ${message}`);
      }
  });
  // socket.send(`Hi there, I'm a WebSocket server`);
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