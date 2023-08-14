const db = require('../db/Database');

class User {
    static findById(id, callback) {
        db.get("SELECT * FROM users WHERE id = ?", [id], callback);
    }

    static findByUsername(username, callback) {
        db.get("SELECT * FROM users WHERE username = ?", [username], callback);
    }

    static create(username, password, callback) {
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], callback);
    }
    // Add other user-related methods as necessary
}

module.exports = User;
