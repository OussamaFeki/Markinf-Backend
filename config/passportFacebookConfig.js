const passport=require('passport')
const FacebookStrategy=require('passport-facebook').Strategy
const modprofile=require('../models/profile')
const {facebook} =require('./config')
var session =require('express-session')
passport.use(new FacebookStrategy({
    clientID:facebook.client_id,
    clientSecret:facebook.client_secret,
    callbackURL:"http://localhost:3000/auth/facebook/callback",
    enableProof:false
 },(accessToken, refreshToken, profile, done)=>{
    modprofile.findOne({facebookId: profile.id},(err,doc)=>{
        if(err){
            return done(err)
        }
        if(doc){
           return done('this fb is already used')
        }else{
            // if there is no user found with that facebook id, create them
            var newprof= new modprofile();

            // set all of the facebook information in our user model
           newprof.facebookId  = profile.id; // set the users facebook id                   
           newprof.token = token; // we will save the token that facebook provides to the user                    
           newprof.username  = profile.displayName; // look at the passport user profile to see how names are returned

            // save our user to the database
            newprof.save(function(err) {
                if (err)
                    throw err;

                // if successful, return the new user
                return done(null, newUser);
            });
        }
    })
    })
)

passport.serializeUser((user,done)=>{
    done(null, user.id)
})
passport.deserializeUser((id,done)=>{
    influencer.findById(id).then((user)=>{
        done(null,user)
    })
})