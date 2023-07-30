const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const DB = "mongodb+srv://ghazanfarmumtaz:news12345@newsarticles.ojmpxjp.mongodb.net/?retryWrites=true&w=majority"

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
app.listen(port, () => console.info(`Server is up on http://localhost:${port}`))