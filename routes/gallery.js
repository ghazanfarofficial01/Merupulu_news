const express = require("express");
const galleryRouter = express.Router();
const isAuth = require("../middlewares/isAuth");
const Article = require("../Models/articles");
const GalleryResource = require("../Models/gallery");


galleryRouter.get("/admin/galleryPopup", isAuth, async (req, res) => {
  try {
    const articles = await Article.find({}).sort({publishedAt:-1}).exec()
    res.render("Gallery/galleryPopup",{articles: articles});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


galleryRouter.get("/admin/gallery", isAuth, async (req, res) => {
  try {
    const articles = await Article.find({}).sort({publishedAt:-1}).exec()
    const gallery = await GalleryResource.find({}).sort({publishedAt:-1}).exec()
    //articles.push(...gallery)
    
    res.render("Gallery/gallery",{articles: articles,galleryUploads: gallery});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

galleryRouter.post("/admin/newGalleryResource", isAuth, async (req, res) => {
  try {
    const { name = "", url = "", videoUrl =  ""} = req.body;
    console.log(req.body);
    if(url === "" && videoUrl === ""){
      throw new Error("select video/image")
    }
     let newResource = new GalleryResource({
      name:name,
      url,
      videoUrl
     })
     await newResource.save();
    res.redirect('/admin/gallery')
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//deleting a gallery item
galleryRouter.delete('/admin/galleryItem/:id',isAuth, async (req,res) =>{
  try{
    const {id} = req.params;
    //console.log(id);
     await GalleryResource.findByIdAndDelete(id);
     await Article.findByIdAndDelete(id);
     res.redirect('/admin/gallery');

  } catch(e){
    res.status(500).json({error: e.message})
  }
})
module.exports = galleryRouter;