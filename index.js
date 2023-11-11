const express = require('express')
const path = require('path')
const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })
const app = express()

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

app.use(express.static(path.join(__dirname, './public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.set('view engine', 'hbs')

db.connect(err => {
    err
        ? console.log(err)
        : console.log('Connected')
})

app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

app.listen(3000, () => console.log(`Server's running at port 3000`))
