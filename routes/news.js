const express = require("express");
const mongoose = require("mongoose");
const newsRouter = express.Router();
const News = require("../Models/articles");

newsRouter.get("/admin/newNews", (req, res) => {
  res.render("newArticle");
});
newsRouter.post("/admin/newNews", async (req, res) => {
  try {
    const { title, url, category, content = "", desc, author = "" } = req.body;
    //console.log(url)
    let news = new News({
      title,
      category,
      url,
      content,
      description: desc,
      author,
    });

    news = await news.save();

    res.redirect("/admin/newNews");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//to fetch news
newsRouter.get("/api/news", async(req, res) => {
  try{  
   const news = await News.find({});
   //console.log(news)
   res.status(200).json(news)
      
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

module.exports = newsRouter;
