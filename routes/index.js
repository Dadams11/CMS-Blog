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
        res.render('dashboard', { posts, username: req.session.user.username });  // Added username to render.
    });
});

// Creating a post (Placeholder)
router.post('/create-post', requireLogin, (req, res) => {
    // TODO: Logic for creating a post
});

// Updating a post (Placeholder)
router.put('/update-post/:id', requireLogin, (req, res) => {
    // TODO: Logic for updating a post
});

// Deleting a post (Placeholder)
router.delete('/delete-post/:id', requireLogin, (req, res) => {
    // TODO: Logic for deleting a post
});

// Adding comments to a post (Placeholder)
router.post('/post/:id/comments', requireLogin, (req, res) => {
    // TODO: Logic for adding comments
});

module.exports = router;
