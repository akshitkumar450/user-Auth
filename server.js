const express = require('express')
const session = require('express-session');
const app = express();
const { db, Users } = require('./db')
const fs = require('fs').promises

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/', express.static(__dirname + '/public'))
app.use('/images', express.static(__dirname + '/images'))

// to make a cookie 
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '24knb6k247b2k7b2k7bk247hb2kh7b2', // it can be any random string
}))

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.post('/signup', upload.single('avatar'), async (req, res) => {
    console.log('req file', req.file);
    console.log('req body', req.body);

    const oldPath = __dirname + '/uploads/' + req.file.filename
    const newPath = __dirname + '/images/' + 'avatar_' + req.body.username + '.' + req.file.mimetype.split('/').pop()

    await fs.rename(oldPath, newPath)

    const user = await Users.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password , //in production we will use hash of password
        avatar: '/images/' + 'avatar_' + req.body.username + '.' + req.file.mimetype.split('/').pop()  
    })
    res.status(201).send(`user ${user.id}  created`)
})

app.get('/login', (req, res) => {
    res.render('login')
})


app.post('/login', async (req, res) => {
    const user = await Users.findOne({ where: { username: req.body.username } }) // we first find the username 
    if (!user) {
        return res.status(404).render('login', { error: 'no such username found' })
    }
    if (user.password !== req.body.password) {
        return res.status(401).render('login', { error: 'incorrect password' })
    }

    req.session.userId = user.id
    res.redirect('/profile')
})

app.get('/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login')
    }
    const user = await Users.findByPk(req.session.userId)
    res.render('profile', { user })
})

app.get('/logout', (req, res) => {
    req.session.userId = null
    res.redirect('/login')
})

db.sync()
    .then(() => {
        app.listen(4567, () => {
            console.log('server started ');
        })
    })
    .catch((e) => {
        console.error(e);
    })




