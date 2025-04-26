const express = require("express")
const app = express()

const server = require("http").Server(app)
const io = require("socket.io")(server)

const port = 3000

server.listen(port, () => {
    console.log(`server is listening on port: ${port}`)
})