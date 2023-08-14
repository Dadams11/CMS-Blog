const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Create users table
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");

    // Create posts table
    db.run(`CREATE TABLE posts (
        id INTEGER PRIMARY KEY,
        title TEXT,
        content TEXT,
        author_id INTEGER,
        dateCreated DATE DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY(author_id) REFERENCES users(id)
    )`);

    // Create comments table
    db.run(`CREATE TABLE comments (
        id INTEGER PRIMARY KEY,
        content TEXT,
        post_id INTEGER,
        author_id INTEGER,
        dateCreated DATE DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY(post_id) REFERENCES posts(id),
        FOREIGN KEY(author_id) REFERENCES users(id)
    )`);
});

db.close();
