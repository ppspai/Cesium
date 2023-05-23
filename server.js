const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
let cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static('public'));

app.listen(8080, () => {
    console.log("Server is running");
})




// app.use('/', (req, res) => {
//     res.send("Hello Cesium");
// });

// app.listen(8080, () => {
//     console.log("Hello Cesium");
// });
