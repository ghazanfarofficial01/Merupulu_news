const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const MongoDBStore = require("connect-mongodb-session")(session);
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const DB = process.env.mongo_url

//mongo session and express session
const store = new MongoDBStore({
    uri: DB,
    collection: "mySessions",
    expires: 1000 * 60 * 60 * 24
  });

  app.use(
    session({
      secret: process.env.session_secret,
      resave: false,
      saveUninitialized: false,
      store: store,
      maxAge: 1000 * 60 * 60 * 24
    })
  );
  //<--------------------------------------->

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
//routes imports
const newsRouter = require('./routes/news');
const authRouter = require('./routes/auth');
const dashRouter = require('./routes/dashboard.js');
const changePasswordRouter = require('./routes/pswrdChange');
//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
app.use(methodOverride('_method'));

app.use(newsRouter);
app.use(authRouter);
app.use(dashRouter);
app.use(changePasswordRouter);  
//db connection
mongoose.connect(DB).then(()=>{
    console.log('connection successful');
}).catch((e)=>{
    console.log(e);
})

//starting server
app.listen(port, () => console.info(`Server is up`))