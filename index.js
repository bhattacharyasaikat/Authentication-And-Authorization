const express = require('express') ;
const dbConnect = require('./Config/database');
const app = express() ;
const cookieParser = require('cookie-parser') ;
app.use(cookieParser()) ;
app.use(express.json()) ;
require('dotenv').config ;

const PORT = process.env.PORT || 4000 ;

// cookie-parser - what is this and why we need this?


dbConnect() ; 

//import routes and mount
const user = require('./routes/user') ;
app.use('/api/v2',user) ;

app.listen(PORT,()=>{
console.log(`App is listening to ${PORT}`) ;
})
