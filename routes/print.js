const express = require('express');
const printRouter = express.Router();
const path = require('path');
const isAuth = require('../middlewares/isAuth')
const News = require("../Models/articles")
const puppeteer = require('puppeteer');
//const chromium = require('chrome-aws-lambda');

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


//for redirecting to app link provided to app developer
printRouter.get('/.well-known/assetlinks.json',(req, res) =>{
  try{
    let outJson = [{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.androtech.merupunews.prod",
    "sha256_cert_fingerprints":
    ["0A:C2:BC:1D:26:B4:86:C3:E4:15:B8:8C:2B:0B:F2:E4:0D:B9:7A:1B:F6:0E:BE:71:23:8E:43:CF:20:52:13:52"]
  }
}];
    res.json(outJson);
  }catch(e){
    res.status(500).json({error: e.message});
  }
})

printRouter.get('/openApp',(req, res) =>{
  try{
    res.redirect('https://play.google.com/store/apps/details?id=com.androtech.merupunews.prod');
  }catch(e){
    res.status(500).json({error: e.message});
  }
})

module.exports = printRouter;
