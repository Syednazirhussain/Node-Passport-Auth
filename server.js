require('dotenv').config()
const express = require('express');
const passport = require('passport');
// const cookieSession = require('cookie-session')
const session = require('express-session');
const app = express();
require('./passport-setup')
app.set("view engine", "ejs")

// app.use(cookieSession({
//     name: 'tuto-session',
//     keys: ['key1', 'key2']
// }))
app.use(session({ 
    secret: 'ssshhhhh', 
    saveUninitialized: true, 
    resave: true 
}));

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}
app.use(passport.initialize());
app.use(passport.session())

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/failed', (req, res) => res.send('You Failed to log in!'))

app.get('/dashboard', isLoggedIn, (req, res) => {
    console.log("user", req.user)
    let payload = {
        name: req.user.displayName,
        email: req.user.emails[0].value,
        profile: req.user.provider
    }

    if (req.user.provider == "linkedin") {
        payload['pic'] = req.user.photos[0].value
    } else {
        payload['pic'] = req.user._json.picture
    }

    console.log("payload", payload);

    res.render('pages/profile.ejs', payload)
})

app.get('/profile', (req, res) => {
    console.log("user", req.user._json)
    res.render('pages/profile', {
        profile: "facebook",
        name: req.user.displayName,
        pic: req.user.photos[0].value,
        email: req.user.emails[0].value // get the user out of session and pass to template
    });
})

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed'
    }),
    (req, res) => {
        res.redirect('/dashboard');
    }
)

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
app.get('/facebook/callback', 
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    })
);

// app.get('/auth/linkedin', passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] }));
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'sindh/karachi' }));
app.get('/linkedin/callback',
    passport.authenticate('linkedin', {
        failureRedirect: '/',
        // successRedirect: '/dashboard'
    }), 
    (req, res) => {
        res.redirect('/dashboard');
    }
);

app.get('/auth/twitter', passport.authenticate('twitter', { scope: ['r_emailaddress', 'r_liteprofile'] }));
app.get('/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/profile',
        failureRedirect: '/'
    })
);

app.listen(PORT, () => {
    console.log(`Server is up ${PORT}`)
})

