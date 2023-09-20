const express = require("express");
const mongoose = require("mongoose");
const newsRouter = express.Router();
const News = require("../Models/articles");
const isAuth = require("../middlewares/isAuth");
newsRouter.get("/admin/newNews", isAuth, (req, res) => {
  res.render("newArticle");
});
newsRouter.post("/admin/newNews", async (req, res) => {
  try {
    
    const {
      title,
      url,
      videoUrl,
      category,
      district,
      content = "",
      source = "",
      desc = "",
      author = "",
      isBreaking = false,
    } = req.body;

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

    res.redirect("/admin/newNews");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//to fetch news
newsRouter.get("/api/news", async (req, res) => {
  const page = parseInt(req.query.page);

  try {
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
    else {
      if (!req.query.category) {
        //const news = await News.find({published:true}).sort({publishedAt:-1}).exec();
        //console.log(news)
        //res.status(200).json(news)

        const options = {
          page,
          limit: 15,
          sort: { publishedAt: -1 }, // Sort in descending order of publishedAt
        };

        const query = { published: true };

        const result = await News.paginate(query, options);
        res.status(200).json(result);
      } else {
        //const news = await News.find({$and:[{published:true},{category: req.query.category}]}).sort({publishedAt:-1}).exec();
        //res.status(200).json(news)

        const options = {
          page,
          limit: 15,
          sort: { publishedAt: -1 }, // Sort in descending order of publishedAt
        };

        const query = {
          published: true,
          category: req.query.category,
        };

        const result = await News.paginate(query, options);
        res.status(200).json(result);
      }
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//getting breaking news
newsRouter.get("/api/news/isBreaking", async (req, res) => {
  const page = parseInt(req.query.page);

  try {
    if(!page){
      const news = await News.find({$and:[{published:true},{isBreaking: true}]}).sort({publishedAt:-1}).exec();
      res.status(200).json(news)
    }
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
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//to fetch news using district field
newsRouter.get('/api/news/district', async (req, res) => {
  try {
    const page = parseInt(req.query.page);

    // Extract the list of districts from the query parameters
    const districts = req.query.districts;

    // Ensure districts parameter is present and not empty
    if (!districts || districts.length === 0) {
      return res.status(400).json({ error: 'Districts parameter is required.' });
    }

    // Convert the districts parameter to an array (if it's a comma-separated string)
    const districtList = Array.isArray(districts) ? districts : districts.split(',');

    // Use Mongoose to query the database based on the district(s)
    if(!page){
    //const news = await News.find({$and:[ {district: { $in: districtList }} ,{published: true}]}).sort({publishedAt:-1}).exec();;
    const news = await News.find({ district: { $in: districtList }, published: true });

    // Return the retrieved news articles
    res.status(200).json(news);
    }else{
      const options = {
        page,
        limit: 15,
        sort: { publishedAt: -1 }, // Sort in descending order of publishedAt
      };
  
      const query = {
        published: true,
        district: { $in: districtList },
      };
  
      const result = await News.paginate(query, options);
      res.status(200).json(result);
    }
  } catch (e) {
    // Handle errors
    
    console.error(e.message);
    res.status(500).json({ error: e.message  });
  }
});

newsRouter.get('/api/news/:id',async (req,res) => {
  try{
    console.log("reached /:id")
    const id = req.params.id;
    //console.log(id);
    let news = await News.findById(id);
    
    res.status(200).json(news);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
})





module.exports = newsRouter;
