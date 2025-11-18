const express = require('express')
const router = express.Router()


const PORT = process.env.PORT || 3000

// Home Page
router.get('/', (req,res)=> {
    res.render('pages/home', {
        title: 'movie-app home',
        name: "Brennan's Movie App"
    })
})

router.get('/', (req, res)=> {
    res.send('<h1>Movie App</h1>')
})

router.get('/movie-form', (req, res)=> {
    res.render('pages/movie-form', {
        title: 'movie form',
        name: 'movie-form'
    })
})

router.get('/api', (req, res)=> {
    res.json({
        'All Movies': `http://localhost:${PORT}/api/movie`,
        'All Actors': `http://localhost:${PORT}/api/actor`,
        'All Directors': `http://localhost:${PORT}/api/director`,
        'All Genres': `http://localhost:${PORT}/api/genre`
    })
})

const endpoints = [
    'movie',
    'actor',
    'director',
    'genre'
]

endpoints.forEach(endpoint => {
    router.use(`/api/${endpoint}`, require(`./api/${endpoint}Routes`))
})

// Error page
router.use((req, res, next)=> {
    res.status(404)
    .render('pages/error', {
        title: 'Error Page',
        name: 'Error'
    })
})

module.exports = router