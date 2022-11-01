require('dotenv').config();
const passport  = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
// const TwitterStrategy = require('passport-twitter').Strategy;
passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true
}, (request, accessToken, refreshToken, profile, done) => {
    // console.log("Request Method", request.method)
    // console.log("Request URL", request.url)
    console.log("profile", profile)
    console.log("Access Token: ", accessToken)
    console.log("refreshToken", refreshToken)
    done(null, profile)
}));


passport.use(new FacebookStrategy({
    clientID        : process.env.FACEBOOK_CLIENT_ID,
    clientSecret    : process.env.FACEBOOK_SECRET_ID,
    callbackURL     : "http://localhost:3000/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
}, (token, refreshToken, profile, done) => {
    // facebook will send back the token and profile
    console.log("token", token)
    console.log("profile", profile)
    console.log("refreshToken", refreshToken)
    return done(null,profile)
}));

passport.use(new LinkedinStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_SECRET_ID,
    callbackURL: "http://localhost:3000/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],
    passReqToCallback: true,
}, (request, accessToken, refreshToken, profile, done) => {
    // console.log("request", request)
    // console.log("profile", profile)
    // console.log("accessToken", accessToken)
    // console.log("refreshToken", refreshToken)
    done(null, profile)
}));

/*
passport.use(new TwitterStrategy({
    clientID: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_SECRET_ID,
    callbackURL: "http://localhost:3000/twitter/callback",
    passReqToCallback: true
}, (request, accessToken, refreshToken, profile, done) => {
    console.log("request", request)
    console.log("profile", profile)
    console.log("accessToken", accessToken)
    console.log("refreshToken", refreshToken)
    done(null, profile)
}));

*/