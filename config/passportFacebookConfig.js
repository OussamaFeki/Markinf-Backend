const passport=require('passport')
const FacebookStrategy=require('passport-facebook').Strategy
const influencer=require('../models/influencers')
const {facebook} =require('./config')
passport.use(new FacebookStrategy({
    clientID:facebook.client_id,
    clientSecret:facebook.client_secret,
    callbackURL:"/auth/facebook/cb"
 },(accessToken, refreshToken, profile, done)=>{
    influencer.findOne({facebookId: profile.id}).then((currentUser)=>{
        if(currentUser){
            done(null, currentUser)
        }else{
            const influencer= new influencer({
                fullname:profile._json.name,
                facebookId:profile.id,
            })
            user.save().then(()=>console.log("user saved to DB."))
            done(null, user) 
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