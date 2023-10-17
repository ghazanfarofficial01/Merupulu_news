const express = require('express');
const compression = require('compression');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const morgan = require('morgan');
const fs = require('fs');
const MongoDBStore = require("connect-mongodb-session")(session);
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const path = require('path');
const mongoose = require('mongoose');
//const mongoosePaginate = require('mongoose-paginate-v2');
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
  app.use(flash());

  
  
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
//routes imports
const newsRouter = require('./routes/news');
const authRouter = require('./routes/auth');
const dashRouter = require('./routes/dashboard.js');
const changePasswordRouter = require('./routes/pswrdChange');
const eventRouter = require('./routes/event');
const advRouter = require('./routes/adv');
const galleryRouter = require('./routes/gallery');
const printRouter = require('./routes/print');
const reporterRouter = require('./routes/reporter');
const logRouter = require('./routes/logs');
const NotificationRouter = require('./routes/notification');
//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
app.use(methodOverride('_method'));
//middleware to not not allow back button/telling browser not to save cache
app.use((req, res, next) => {
  // Prevent caching for all routes
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

// Compress all HTTP responses
app.use(compression({
  level:9
}));



//--------------------------------------------------------------
//morgan
// app.use(morgan('combined'))
// // Define a custom morgan token to log in JSON format
// morgan.token('json', (req, res) => {
//   return JSON.stringify({
//     remote_addr: req.ip,
//     date: new Date(),
//     method: req.method,
//     url: req.originalUrl,
//     status: res.statusCode,
//     response_time: `${res['response-time']}ms`,
//   });
// });
// // Creating a write stream for logs
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, 'access.log'),
//   { flags: 'a' }
// );
// // Using Morgan to log API calls to a file
// app.use(morgan(':json', { stream: accessLogStream }));
//-----------------------------------------------------------------


//middleware to not not allow back button/telling browser not to save cache
app.use((req, res, next) => {
  // Prevent caching for all routes
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

// Compress all HTTP responses
app.use(compression());

app.use(NotificationRouter);
app.use(newsRouter);
app.use(authRouter);
app.use(dashRouter);
app.use(changePasswordRouter);  
app.use(eventRouter)
app.use(advRouter)
app.use(galleryRouter)
app.use(printRouter)
app.use(reporterRouter)
//app.use(logRouter)
//db connection
mongoose.connect(DB).then(()=>{
    console.log('connection successful');
}).catch((e)=>{
    console.log(e);
})

//starting server
app.listen(port, () => console.info(`Server is up`))
