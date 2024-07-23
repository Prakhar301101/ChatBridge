require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const userRoutes = require('./routes/userRoutes');
const ws = require('websocket');
const webSocketServer = ws.server;

app.use(express.json());
app.use(cors({
  credentials: true,
  origin:'https://chatbridge-92b16.web.app',
}));
app.use(cookieParser());
mongoose.connect(process.env.MONGODB_URL);

app.use(userRoutes);

//webSocket Server
const server = app.listen(PORT, () =>
  console.log(`Server started at port:${PORT}`)
);
const wss = new webSocketServer({ httpServer: server });
const clients = {};

//function to broadcast clients
function broadcast(message) {
  Object.values(clients).forEach((client) => {
    if (client.connected) {
      client.sendUTF(JSON.stringify(message));
    }
  });
}

//function to list all the connected clients to the websocketServer
function listConnectedClients() {
  return Object.values(clients).map((client) => ({
    userId: client.userId,
    userName: client.userName,
  }));
}

//websocketserver on a request from client
wss.on('request', (request) => {
  //accepting the connection request from client
  const connection = request.accept(null, request.origin);

  //getting token from the URL param
  

  const cookie=request.cookies[0];
  const jwtToken=cookie.value;
  if (jwtToken) {
    jwt.verify(jwtToken, process.env.SECRET, {}, (err, userData) => {
      if (err) throw err;
      else{
      const {id, name} = userData;
      connection.userId = id;
      connection.username = name;
      clients[id] = connection;
      broadcast({ type: 'connectedClients', clients: listConnectedClients() });
    }
  });
  } 
  connection.on('message', async (message) => {
    const messageData = JSON.parse(message.utf8Data);
    const { recipient, text } = messageData;
    if (recipient && text) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
      });
      Object.values(clients)
        .filter((client) => client.userId === recipient)
        .forEach((client) => {
          if (client.connected) {
            client.sendUTF(
              JSON.stringify({
                text,
                sender: connection.userId,
                recipient,
                id: messageDoc._id,
              })
            );
          }
        });
      }
      else console.log('Not able to send message to recepient')
  });

  connection.on('close',()=>{
    delete clients[connection.userId];
    broadcast({ type: 'connectedClients', clients: listConnectedClients() });
  })

});