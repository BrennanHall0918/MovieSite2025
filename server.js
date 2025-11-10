// Server
const express = require('express')
const server = express()
const PORT = process.env.PORT || 3000

server.listen(PORT, ()=> console.log(`The server is listening at https://localhost:${PORT}. Ctrl+C to exit.`))