require('dotenv').config()
module.exports={
    port:3000,
    facebook:{
        client_id:process.env.CLIENTID,
        client_secret:process.env.CLIENTSECRET
    }
}