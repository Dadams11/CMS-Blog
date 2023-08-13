const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = new (require('sqlite3').verbose()).Database('./db/database.sqlite');

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if(err) throw err;

        if(user && bcrypt.compareSync(password, user.password)) {
            req.session.user = { id: user.id, username: user.username };
            res.redirect('/dashboard');
        } else {
            // TODO: Add error message handling
            res.redirect('/users/login');
        }
    });
});

// Signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
        if(err) throw err;
        // Redirect to login or another appropriate page after signing up
        res.redirect('/users/login');
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
