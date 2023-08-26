const express = require('express');
const printRouter = express.Router();
const path = require('path');
const isAuth = require('../middlewares/isAuth')
const News = require("../Models/articles")
const puppeteer = require('puppeteer');


printRouter.get('/articlePrintLayout', async(req, res)=>{
    try {
     const articles = await News.find({published:true}).sort({publishedAt:-1}).exec();
    res.render("PrintLayout/article",{articles});
    } catch(e){
        res.status(500).json({error: e.message});
    }
})

printRouter.get('/admin/print', async(req, res) => {
  res.contentType("application/pdf")
  try {
   const url = "https://merupulu-news.onrender.com/articlePrintLayout";
   const filePath = path.resolve(__dirname, '/articles.pdf');
   

    const browser = await puppeteer.launch({headless: "new",defaultViewport: null});
    const page = await browser.newPage();
  
    await page.goto(url, {waitUntil: 'networkidle0' });
    
    await page.addStyleTag({
      content: `
      @font-face {
        font-family: 'TeluguFont';
         src: url('https://fonts.googleapis.com/css2?family=Noto+Serif+Telugu:wght@200;300&display=swap') format('truetype');
 }
      `
    });

    //To reflect CSS used for screens instead of print
     await page.emulateMediaType('screen');
     const height = await page.evaluate(() => document.documentElement.offsetHeight);
    const pdf = await page.pdf({ printBackground: true, preferCSSPageSize:false, height:height,margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
  });
    await browser.close();
  
    res.send(pdf);
  } catch (e) {
      res.status(500).json({error: e.message});
  }
})

module.exports = printRouter;
