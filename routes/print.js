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

try {
 const url = "http://localhost:3000/articlePrintLayout";
 const filePath = path.resolve(__dirname, '/articles.pdf');

  const browser = await puppeteer.launch({headless: true,defaultViewport: null});
  const page = await browser.newPage();

  await page.goto(url, {waitUntil: 'networkidle0' });

  //To reflect CSS used for screens instead of print
   await page.emulateMediaType('screen');
   const height = await page.evaluate(() => document.documentElement.offsetHeight);
  await page.pdf({ path: filePath, printBackground: true, preferCSSPageSize:false, height:height,margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
});
  await browser.close();

  res.download(filePath);
} catch (e) {
    res.status(500).json({error: e.message});
}
})

module.exports = printRouter;
