const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const expressHandlebars = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3000;

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup for Handlebars
const hbs = expressHandlebars.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Set up sessions with SQLite
app.use(session({
    store: new SQLiteStore,
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 }  // 10-minute session timeout
}));

// Check if user's session is still active
app.use((req, res, next) => {
    if (req.session.user && !req.cookies.user_sid) {
        res.clearCookie('user_sid');        
    }
    next();
});

// Routes
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');

app.use('/', indexRoutes);
app.use('/users', userRoutes);

// Server listening
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
