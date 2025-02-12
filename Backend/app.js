const express = require('express');
const app = express();
require('dotenv').config()
var bodyParser = require('body-parser');
const itemRoutes=require('./routes/itemRoutes');
const userRoutes=require('./routes/userRoutes')
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const session = require("express-session");
mongoose.connect(process.env.uri).then(
  app.listen(4000, () => {
    console.log('Server listening on port http://127.0.0.1:4000');
  })
)
app.use(session({
  secret: "dheeraj",
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 20//20 min
  }
}));
app.use(cookieParser());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/items',itemRoutes)
app.use('/',userRoutes)

