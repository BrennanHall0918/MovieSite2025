// Server
const express = require('express')
const server = express()
const PORT = process.env.PORT || 3000

// Handle security
const helmet = require('helmet')
const cors = require('cors')

// helmet config
server.use(helmet.contentSecurityPolicy({
    userDefaults: true,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    directives: {
        "img-src": ["'self'", "https: data"],
        "scriptSrc": ["'self'", "cdn.jsdelivr.net"]
    }
}))


server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true}))

server.listen(PORT, ()=> console.log(`The server is listening at https://localhost:${PORT}. Ctrl+C to exit.`))