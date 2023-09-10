const express = require("express");
const mongoose = require("mongoose");
const newsRouter = express.Router();
const News = require("../Models/articles");
const isAuth = require("../middlewares/isAuth")
newsRouter.get("/admin/newNews", isAuth, (req, res) => {
  res.render("newArticle");
});
newsRouter.post("/admin/newNews", async (req, res) => {
  try {
    const { title, url, videoUrl ,category, content = "",source="", desc = "", author = "" , isBreaking = false } = req.body;
   
    let news = new News({
      isBreaking,
      title,
      category,
      url,
      videoUrl,
      content,
      source,
      description: desc,
      author,
    });
     
    news = await news.save();

    res.redirect("/admin/dashboard");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//to fetch news
newsRouter.get("/api/news", async(req, res) => {
  try{  
    if(!req.query.category){
       const news = await News.find({published:true}).sort({publishedAt:-1}).exec();
      //console.log(news)
      res.status(200).json(news)
  }
  else{
    const news = await News.find({$and:[{published:true},{category: req.query.category}]}).sort({updatedAt:-1}).exec();
      res.status(200).json(news)
  }
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

//getting breaking news
newsRouter.get("/api/news/isBreaking", async(req, res) => {
  try{  
     const news = await News.find({$and:[{published:true},{isBreaking: true}]}).sort({updatedAt:-1}).exec();
      res.status(200).json(news)
  
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});


module.exports = newsRouter;
