const db = require('../db/Database');

class Comment {
    static findByPostId(postId, callback) {
        db.all("SELECT * FROM comments WHERE post_id = ?", [postId], callback);
    }

    static create(content, user_id, post_id, callback) {
        db.run("INSERT INTO comments (content, user_id, post_id) VALUES (?, ?, ?)", [content, user_id, post_id], callback);
    }

    // Add other comment-related methods as necessary
}

module.exports = Comment;
