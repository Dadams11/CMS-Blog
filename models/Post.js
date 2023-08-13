const db = new (require('sqlite3').verbose()).Database('./db/database.sqlite');

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

    // For example, delete a post by its ID
    static deleteById(id, callback) {
        db.run("DELETE FROM posts WHERE id = ?", [id], callback);
    }

    // Add other post-related methods as necessary
}

module.exports = Post;
