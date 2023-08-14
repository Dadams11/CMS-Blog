const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

class Database {
    constructor() {
        this.connection = new sqlite3.Database(dbPath);
    }

    get() {
        return this.connection;
    }
}

module.exports = new Database().get();
