const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach";

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();

app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
let interval;

const getApiAndEmit = async (socket) => {
  try {
    const res = await axios.get(citybikeurl);
    console.log("Call API");
    // Emit Menssage for client react
    socket.emit("FromcitybikeApi", res.data.network);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

io.on("connection", (socket) => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 5000);

  console.log("New connection " + socketId + " from " + clientIp);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
