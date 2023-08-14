const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');

console.log("Users route file loaded");

router.get('/login', (req, res) => {
    console.log("Login GET route hit");
    res.render('login');
});

router.get('/signup', (req, res) => {
    console.log("Signup GET route hit");
    res.render('signup');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findByUsername(username, (err, user) => {
        if (err) throw err;

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = { id: user.id, username: user.username };
            res.redirect('/users/dashboard');
        } else {
            res.redirect('/login');
        }
    });
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    User.create(username, hashedPassword, (err) => {
        if (err) throw err;
        res.redirect('/login');
    });
});

router.get('/logout', (req, res) => {
    req.session.user = null;
    res.redirect('/login');
});

router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('dashboard', { user: req.session.user });
});

module.exports = router;
