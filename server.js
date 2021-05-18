//How to use Express: https://www.youtube.com/watch?v=Lr9WUkeYSA8&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&index=6
const express = require('express')
const app = express()

const _ = require('lodash')

app.listen(3000)

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile('./public/index.html', { root: './' });
});

app.get('/api', (req, res) => {
    res.redirect('/')
})

app.get('/api/custom_random', (req, res) => {
    res.redirect('/')
})

app.get('/api/random', (req, res) => {
    // Generate a random number with Lodash: https://lodash.com/docs/4.17.15#random
    res.json({ number: _.random(1023) })
})

// How to use dynamic URLs with express: https://www.tutorialspoint.com/expressjs/expressjs_url_building.htm
app.get('/api/custom_random/:num', (req, res) => {
    res.json({ number: _.random(req.params.num) })
})

app.post('/', (req, res) => {
    let i = 0;

    _.each(req.body.string, (el => {
        if (/[aeiou]/.test(el)) {
            i++
        }
    }))

    res.json({ vowels: i })
})

app.use((req, res) => {
    res.status(404).sendFile('./public/404.html', { root: './' })
})