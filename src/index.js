const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const db = require('./config/db');
const app = express();
const server = require('http').createServer(app);
const routes = require("./routes/routes")
const port = process.env.PORT || 3000;
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
db.connect();


app.use("/api",routes);

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})