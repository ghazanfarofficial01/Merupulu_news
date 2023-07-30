const express = require('express');
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const DB = process.env.mongo_url

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
//routes imports
const newsRouter = require('./routes/news');
//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

app.use(newsRouter);
//db connection
mongoose.connect(DB).then(()=>{
    console.log('connection successful');
}).catch((e)=>{
    console.log(e);
})

//starting server
app.listen(port, () => console.info(`Server is up`))