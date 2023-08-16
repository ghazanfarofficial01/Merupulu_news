const express = require("express");
const galleryRouter = express.Router();
const isAuth = require("../middlewares/isAuth");
const Article = require("../Models/articles");

//Add Adv Page Render Route
galleryRouter.get("/admin/galleryPopup", isAuth, async (req, res) => {
  try {
    const articles = await Article.find({}).sort({publishedAt:-1}).exec()
    res.render("Gallery/galleryPopup",{articles: articles});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = galleryRouter;