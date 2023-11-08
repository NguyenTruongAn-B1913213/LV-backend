const express = require("express");
const { createServer } = require("http");
const { join } = require("path");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const db = require("./config/db");
const routes = require("./routes/routes");
const app = express();
const server = createServer(app);

const port = process.env.PORT || 3000;
const corsOptions = {
  origin: "http://localhost:8080", // Replace with the origin you want to allow
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
const io = new Server(server, {
  cors: corsOptions, // Use corsOptions for Socket.IO
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db.connect();
app.use("/api", routes);
app.set("io", io);
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
server.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
