const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = new (require('sqlite3').verbose()).Database('./db/database.sqlite');

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/users/login');
    }
}

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
        res.redirect('/users/login');
    });
});

// Dashboard & Blog Posts Management
router.get('/dashboard', isAuthenticated, (req, res) => {
    // Fetch and render user's blog posts
});

router.post('/create-post', isAuthenticated, (req, res) => {
    const { title, content } = req.body;
    const userId = req.session.user.id;
    db.run("INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)", [title, content, userId], (err) => {
        if (err) throw err;
        res.redirect('/dashboard');
    });
});

router.get('/edit-post/:id', isAuthenticated, (req, res) => {
    // Fetch the post and render edit form
});

router.post('/edit-post/:id', isAuthenticated, (req, res) => {
    // Update post logic
});

router.get('/delete-post/:id', isAuthenticated, (req, res) => {
    // Delete post logic
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
