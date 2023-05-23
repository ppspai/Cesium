const express = require("express");
require("dotenv").config();
// const { createProxyMiddleware } = require("http-proxy-middleware");
let cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static('public'));

app.listen(8080, () => {
    console.log("Server is running");
})