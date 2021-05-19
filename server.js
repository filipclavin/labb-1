//How to use Express: https://www.youtube.com/watch?v=Lr9WUkeYSA8&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&index=6
const express = require('express')
const app = express()

const fs = require('fs')

const _ = require('lodash')

const mysql = require('mysql')

const bodyparser = require('body-parser')

app.use(bodyparser.json())

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'GuestbookDB',
    multipleStatements: true
})

mysqlConnection.connect((err) => {
    if (!err) console.log('DB connection succeeded');
    else console.log('DB connection failed \n Error: ' + JSON.stringify(err, undefined, 2));
})

app.listen(3000)

let reqsMade = 0;

app.get('/api/random', (req, res) => {
    reqsMade++
    // Generate a random number with Lodash: https://lodash.com/docs/4.17.15#random
    let number = { number: _.random(1023) }
    let data = JSON.stringify(number)

    fs.writeFileSync('./public/random.json', data)
    res.sendFile('./public/random.json', { root: './' })
})

// How to use dynamic URLs with express: https://www.tutorialspoint.com/expressjs/expressjs_url_building.htm
app.get('/api/custom_random/:num', (req, res) => {
    reqsMade++

    let number = { number: _.random(req.params.num) }
    let data = JSON.stringify(number)

    fs.writeFileSync('./public/custom_random.json', data)

    res.sendFile('./public/custom_random.json', { root: './' })
})


app.post('/vowels/:input', (req, res) => {
    reqsMade++

    let vowels = 0

    _.each(req.params.input, (el => {
        if (/[aeiou]/.test(el)) {
            vowels++
        }
    }))

    res.json({ vowels })
})

app.get('/usage', (req, res) => {
    reqsMade++
    res.send(`You've made ${reqsMade} ${reqsMade === 1 ? 'request' : 'requests'} this session (including this one).`)
})

app.get('/guestbook', (req, res) => {
    reqsMade++
    mysqlConnection.query('SELECT * FROM guestbook', (err, rows, fields) => {
        if (!err) res.send(rows)
        else console.log(err);
    })
})

app.get('/guestbook/:id', (req, res) => {
    reqsMade++
    mysqlConnection.query('SELECT * FROM guestbook WHERE EntryID = ?', [req.params.id], (err, rows, fields) => {
        if (!err) res.send(rows)
        else console.log(err);
    })
})

app.delete('/guestbook/:id', (req, res) => {
    reqsMade++
    mysqlConnection.query('DELETE FROM guestbook WHERE EntryID = ?', [req.params.id], (err, rows, fields) => {
        if (!err) res.send('Deletion successful')
        else console.log(err);
    })
})

app.post('/guestbook', (req, res) => {
    reqsMade++
    let entry = req.body;
    const sql = "SET @EntryID = ?;SET @Name = ?;SET @Msg = ?; \
    CALL GuestbookAddOrEdit(@EntryID,@Name,@Msg);"
    mysqlConnection.query(sql, [entry.EntryID, entry.Name, entry.Msg,], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (element.constructor == Array) {
                    res.json(element[0])
                }
            });
        }
        else console.log(err);
    })
})

app.put('/guestbook', (req, res) => {
    reqsMade++
    let entry = req.body;
    const sql = "SET @EntryID = ?;SET @Name = ?;SET @Msg = ?; \
    CALL GuestbookAddOrEdit(@EntryID,@Name,@Msg);"
    mysqlConnection.query(sql, [entry.EntryID, entry.Name, entry.Msg,], (err, rows, fields) => {
        if (!err) res.send('Update successful')
        else console.log(err);
    })
})