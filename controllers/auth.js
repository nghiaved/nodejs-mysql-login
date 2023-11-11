const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.register = (req, res) => {
    const { username, password } = req.body
    db.query(
        'SELECT username FROM users WHERE username = ?',
        [username],
        async (error, results) => {
            if (error) console.log(error)
            if (results.length > 0) {
                return res.render('register', { message: 'That email is already in use' })
            }


            let hashedPassword = await bcrypt.hash(password, 8)
            db.query('INSERT INTO users SET ?',
                { username, password: hashedPassword },
                (error, results) => {
                    if (error) console.log(error)
                    else {
                        return res.render('register', { success: 'User registered' })
                    }
                })


        }
    )
}

exports.login = (req, res) => {
    const { username, password } = req.body
    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (error, results) => {
            if (error) console.log(error)
            if (results.length > 0) {
                let isMatch = await bcrypt.compare(password, results[0].password)
                if (isMatch) {
                    const userInfo = results[0]
                    delete userInfo.password
                    let token = jwt.sign({ ...userInfo }, 'secretKey', { expiresIn: '1d' })
                    return res.render('index', { success: `User logined`, token })
                } else {
                    return res.render('index', { message: `Password incorrect` })
                }
            } else {
                return res.render('index', { message: `User's not existed` })
            }
        }
    )
}