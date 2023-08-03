const express = require("express");
const mongoose = require("mongoose");
const newsRouter = express.Router();
const News = require("../Models/articles");
const isAuth = require("../middlewares/isAuth")
newsRouter.get("/admin/newNews", isAuth, (req, res) => {
  res.render("newArticle");
});
newsRouter.post("/admin/newNews",isAuth, async (req, res) => {
  try {
    const { title, url, category, content = "",source="", desc, author = "" } = req.body;
    //console.log(url)
    let news = new News({
      title,
      category,
      url,
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
       const news = await News.find({});
      //console.log(news)
      res.status(200).json(news)
  }
  else{
    const news = await News.find({category: req.query.category});
      res.status(200).json(news)
  }
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});



module.exports = newsRouter;
