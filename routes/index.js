const express = require('express');
const router = express.Router();

const Post = require('../models/Post');
const Comment = require('../models/Comment');

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    next();
};

// Home Route
router.get('/', (req, res) => {
    Post.findAll((err, posts) => {
        if(err) {
            // Error Handling
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        res.render('home', { posts, user: req.session.user });
    });
});

// Individual Post Route
router.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    Post.findById(postId, (err, post) => {
        if(err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        
        Comment.findByPostId(postId, (err, comments) => {
            if(err) {
                console.error(err);
                return res.status(500).send("Internal Server Error");
            }
            res.render('post', { post, user: req.session.user, comments });
        });
    });
});

// Create a new post
router.post('/create-post', requireLogin, (req, res) => {
    const { title, content } = req.body;
    Post.create(title, content, req.session.user.id, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect('/'); 
    });
});

// Update an existing post
router.put('/update-post/:id', requireLogin, (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;
    Post.update(postId, title, content, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect(`/post/${postId}`);
    });
});

// Delete a post
router.delete('/delete-post/:id', requireLogin, (req, res) => {
    const postId = req.params.id;
    Post.deleteById(postId, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect('/');
    });
});

// Add a comment to a post
router.post('/post/:id/comments', requireLogin, (req, res) => {
    const postId = req.params.id;
    const { content } = req.body;
    Comment.create(content, req.session.user.id, postId, (err) => {
        if(err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect(`/post/${postId}`);
    });
});

module.exports = router;
