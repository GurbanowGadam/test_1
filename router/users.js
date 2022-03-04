const express = require("express");
const router = express.Router();
const user = require('../models/user')

router.get('/register', (req, res) => {
    res.render('site/register');
})

router.post('/register',(req, res) => {

    user.create(req.body,(error, user) => {
        res.redirect('/')
    })
})

router.get('/login', (req, res) => {
    res.render('site/login');
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    user.findOne({ email }, (err, user) => {
        if (user) {
            if (password == user.password) {
                req.session.userId = user._id
                res.redirect('/');
            } else {
                res.redirect('/users/login');
            }
        } else {
            res.redirect('/users/register')
        }
    })
})

module.exports = router;