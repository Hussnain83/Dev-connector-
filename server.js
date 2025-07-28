// importing modules

const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./db");
const bodyParser = require("body-parser");

// body parser

app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Import the router files
const userRoutes = require("./routes/userRoutes");

// use the routers
app.use("/user", userRoutes);



app.listen(PORT, ()=>{
    console.log("listening on port",PORT);
})

