const passport=require('passport')
const FacebookStrategy=require('passport-facebook').Strategy
const modprofile=require('../models/profile')
const {facebook} =require('./config')
var session =require('express-session')
passport.use(new FacebookStrategy({
    clientID:facebook.client_id,
    clientSecret:facebook.client_secret,
    callbackURL:"http://localhost:3000/auth/facebook/cb"
 },(accessToken, refreshToken, profile, done)=>{
    modprofile.findOne({facebookId: profile.id}).then((currentUser)=>{
        if(currentUser){
            done('this fb is already used')
        }else{
            const newprofile = new modprofile({
                username:profile._json.name,
                facebookId:profile.id
            })
            newprofile.save().then(()=>console.log("user saved to DB."))
            done(null, newprofile) 
        }
    })
}))

passport.serializeUser((user,done)=>{
    done(null, user.id)
})
passport.deserializeUser((id,done)=>{
    influencer.findById(id).then((user)=>{
        done(null,user)
    })
})