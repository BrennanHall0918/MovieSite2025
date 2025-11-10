const express = require('express')
const router = express.Router()
const PORT = process.env.PORT || 3000

// Root Route (apis)
router.get('/api', (req, res)=> {
    res.json({
        'All Movies': `http://localhost:${PORT}/api/movie`
    })
})


// Error Page
router.use((req, res, next)=> {
    res.send(404)
    .send('<h1>404 Error: This page does not exist</h1>')
})

module.exports = router