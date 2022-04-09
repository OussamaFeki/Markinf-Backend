require('dotenv').config()
module.exports={
    port:3000,
    database:{
      dbUri: process.env.DBURI
    },
    facebook:{
        client_id:process.env.CLIENTID,
        client_secret:process.env.CLIENTSECRET
    }
}