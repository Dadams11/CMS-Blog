const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const expressHandlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const hbs = expressHandlebars.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session({
    store: new SQLiteStore({
        db: 'database.sqlite',
        dir: path.join(__dirname, 'db'),
        table: 'sessions'
    }),
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000,
        sameSite: true
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && (!req.session || !req.session.user)) {
        res.clearCookie('user_sid');
    }
    next();
});

const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');

app.use('/', indexRoutes); 
app.use('/users', userRoutes); // Use '/users' as the prefix for user routes

// 404 handler should be the last route
app.get('*', (req, res) => {
    res.status(404).send('Page Not Found');
});

// General error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
