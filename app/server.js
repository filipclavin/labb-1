//How to use Express: https://www.youtube.com/watch?v=Lr9WUkeYSA8&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&index=6
const express = require('express')
const app = express()

const fs = require('fs')

const _ = require('lodash')

const mysql = require('mysql')

const bodyparser = require('body-parser')
const { lowerFirst } = require('lodash')

app.use(bodyparser.json())

app.use(express.static('public'))

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

let requests = 0;

app.get('/api/random', (req, res) => {
    requests++
    // Generate a random number with Lodash: https://lodash.com/docs/4.17.15#random
    let number = { number: _.random(1023) }
    let data = JSON.stringify(number)

    fs.writeFileSync('./public/random.json', data)
    res.sendFile('./public/random.json', { root: './' })
})

// How to use dynamic URLs with express: https://www.tutorialspoint.com/expressjs/expressjs_url_building.htm
app.get('/api/custom_random/:num', (req, res) => {
    requests++

    const regex = new RegExp(/-?\d+$/)

    if (regex.test(req.params.num)) {
        let number = { number: _.random(req.params.num) }
        let data = JSON.stringify(number)

        fs.writeFileSync('./public/custom_random.json', data)

        res.sendFile('./public/custom_random.json', { root: './' })

    } else {
        res.status(404).send('Invalid input. Please enter an integer.')
    }
})


app.post('/api/vowels/:input', (req, res) => {
    requests++
    console.log('request made');

    let vowels = 0

    _.each(req.params.input, (el => {
        if (/[aeiou]/.test(el)) {
            vowels++
        }
    }))

    res.send({ vowels })
})

app.get('/api/usage', (req, res) => {
    requests++
    res.send({ requests })
})

app.get('/api/guestbook', (req, res) => {
    requests++
    mysqlConnection.query('SELECT * FROM guestbook', (err, rows, fields) => {
        if (!err) res.send(rows)
        else console.log(err);
    })
})

app.get('/api/guestbook/:id', (req, res) => {
    requests++
    mysqlConnection.query('SELECT * FROM guestbook WHERE EntryID = ?', [req.params.id], (err, rows, fields) => {
        if (!err) res.send(rows[0])
        else console.log(err);
    })
})

app.delete('/api/guestbook/:id', (req, res) => {
    requests++
    mysqlConnection.query('DELETE FROM guestbook WHERE EntryID = ?', [req.params.id], (err, rows, fields) => {
        if (!err) res.send('Deletion successful')
        else console.log(err);
    })
})

app.post('/api/guestbook', (req, res) => {
    requests++
    let entry = req.body;
    const sql = "SET @EntryID = ?;SET @Name = ?;SET @Msg = ?; \
    CALL GuestbookAddOrEdit(@EntryID,@Name,@Msg);"
    mysqlConnection.query(sql, [entry.EntryID, entry.Name, entry.Msg,], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (element.constructor == Array) {
                    res.send(element[0])
                }
            });
        }
        else console.log(err);
    })
})

app.put('/api/guestbook', (req, res) => {
    requests++
    let entry = req.body;
    const sql = "SET @EntryID = ?;SET @Name = ?;SET @Msg = ?; \
    CALL GuestbookAddOrEdit(@EntryID,@Name,@Msg);"
    mysqlConnection.query(sql, [entry.EntryID, entry.Name, entry.Msg,], (err, rows, fields) => {
        if (!err) res.send('Update successful')
        else console.log(err);
    })
})

const balance = {
    bankBalance: 1000,
    walletBalance: 200
}

app.get('/api/bank/balance', (req, res) => {
    requests++
    res.send(balance)
})

app.post('/api/bank/deposit/:amount', (req, res) => {
    const regex = new RegExp(/-?\d+$/)

    if (req.params.amount <= balance.walletBalance && regex.test(req.params.amount)) {
        balance.walletBalance -= _.toNumber(req.params.amount)
        balance.bankBalance += _.toNumber(req.params.amount)

        res.send(balance)
    } else if (req.params.amount > balance.walletBalance) {
        res.status(403).send('You cannot deposit more than your wallet balance.')
    } else {
        res.status(404).send('Please enter an integer.')
    }
})

app.post('/api/bank/withdraw/:amount', (req, res) => {
    const regex = new RegExp(/-?\d+$/)

    if (req.params.amount <= balance.bankBalance && regex.test(req.params.amount)) {
        balance.bankBalance -= _.toNumber(req.params.amount)
        balance.walletBalance += _.toNumber(req.params.amount)

        res.send(balance)
    } else if (req.params.amount > balance.bankBalance) {
        res.status(403).send('You cannot withdraw more than your bank balance.')
    } else {
        res.status(404).send('Please enter an integer.')
    }
})