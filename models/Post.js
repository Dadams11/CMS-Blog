const db = require('../db/Database');

class Post {
    static findById(id, callback) {
        db.get("SELECT * FROM posts WHERE id = ?", [id], callback);
    }

    static findAll(callback) {
        db.all("SELECT * FROM posts", callback);
    }

    static create(title, content, author_id, callback) {
        db.run("INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)", [title, content, author_id], callback);
    }

    static update(id, title, content, callback) {
        db.run("UPDATE posts SET title = ?, content = ? WHERE id = ?", [title, content, id], callback);
    }

    static deleteById(id, callback) {
        db.run("DELETE FROM posts WHERE id = ?", [id], callback);
    }
}

module.exports = Post;
