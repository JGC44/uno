const passport =require("passport")
const GoogleStrategy=require("passport-google-oauth20").Strategy;

passport.serializeUser(function(user,done){
    done(null, user);
})

passport.deserializeUser(function(user, done) {
    //User.findById(id, function(err, user) {
        done(null, user);
    //});
});

//var passport = require('passport');
//var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;

passport.use(new GoogleStrategy({
    clientID: "1047772036790-jt8tur4017vaoe3fgcqqkqklbsvs7vlg.apps.googleusercontent.com",
    clientSecret: "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",
    //callbackURL: "https://uno-jgc2.herokuapp.com/google/callback"
    callbackURL: "http://localhost:5000/google/callback"
  },
  function(token, tokenSecret, profile, done) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(null, profile);
    //});
}
));