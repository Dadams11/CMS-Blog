const express = require('express');
const router = express.Router();
const db = new (require('sqlite3').verbose()).Database('./db/database.sqlite');

// Middleware to check if a user is logged in
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    next();
};

// Homepage
router.get('/', (req, res) => {
    db.all("SELECT * FROM posts", (err, posts) => {
        if(err) throw err;
        res.render('home', { posts, user: req.session.user });
    });
});

// View a single post
router.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    db.get("SELECT * FROM posts WHERE id = ?", [postId], (err, post) => {
        if(err) throw err;
        // TODO: Fetch comments for the post and render them
        res.render('post', { post, user: req.session.user });
    });
});

// Dashboard
router.get('/dashboard', requireLogin, (req, res) => {
    const userId = req.session.user.id;
    db.all("SELECT * FROM posts WHERE author_id = ?", [userId], (err, posts) => {
        if(err) throw err;
        res.render('dashboard', { posts });
    });
});

// TODO: Add more routes for creating, updating, deleting posts, and adding comments

module.exports = router;
