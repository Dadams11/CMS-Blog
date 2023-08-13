// Middleware function to check if a user is authenticated
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    next();
}

// Middleware function to redirect already authenticated users from login/signup pages
function redirectIfLoggedIn(req, res, next) {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    next();
}

module.exports = {
    requireLogin,
    redirectIfLoggedIn
};
