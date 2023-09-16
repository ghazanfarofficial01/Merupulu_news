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
    const { title, url, videoUrl ,category, district,content = "",source="", desc = "", author = "" , isBreaking = false } = req.body;
   
    let news = new News({
      isBreaking,
      title,
      category,
      district,
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
  const page = parseInt(req.query.page);
  
  try{  
    //if page parameter is not passed send all the data at once
    if (!page) {
      if (!req.query.category) {
        const news = await News.find({ published: true })
          .sort({ publishedAt: -1 })
          .exec();
        res.status(200).json(news);
      } else {
        const news = await News.find({
          $and: [{ published: true }, { category: req.query.category }],
        })
          .sort({ publishedAt: -1 })
          .exec();
        res.status(200).json(news);
      }
    }
    //if page parameter is passed paginate the response
    else{
    if(!req.query.category){
       const options = {
        page,
        limit:15,
        sort: { publishedAt: -1 }, // Sort in descending order of publishedAt
      };
  
      const query = { published: true};
  
      const result = await News.paginate(query, options);
      res.status(200).json(result);
  }
  else{
    const options = {
      page,
      limit:15,
      sort: { publishedAt: -1 }, // Sort in descending order of publishedAt
    };

    const query = { 
      published: true,
      category:req.query.category
    };

    const result = await News.paginate(query, options);
    res.status(200).json(result);
  }
}
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});

//getting breaking news
newsRouter.get("/api/news/isBreaking", async(req, res) => {
  const page = parseInt(req.query.page);
  try{  
    //if page parameter is not present
    if(!page){
     const news = await News.find({$and:[{published:true},{isBreaking: true}]}).sort({publishedAt:-1}).exec();
      res.status(200).json(news)
    }
      
    //if page parameter is present paginate  
    else{
      const options = {
      page,
      limit: 15,
      sort: { publishedAt: -1 }, // Sort in descending order of publishedAt
    };

    const query = {
      published: true,
      isBreaking: true,
    };

    const result = await News.paginate(query, options);
    res.status(200).json(result);
    }
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});


module.exports = newsRouter;
