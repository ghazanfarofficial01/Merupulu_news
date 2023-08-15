const express = require("express");
const advRouter = express.Router();
const isAuth = require("../middlewares/isAuth");
const Adv = require("../Models/advertisement");

//Add Adv Page Render Route
advRouter.get("/admin/createAdv", isAuth, async (req, res) => {
  try {
    res.render("createAdv");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

advRouter.post("/admin/createAdv", isAuth, async (req, res) => {
  try {
    let adv = new Adv(req.body);
    adv = await adv.save();

    res.redirect("/admin/dashboard");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//to fetch advertisement for mobile application
advRouter.get("/api/getAdvertisements", async (req, res) => {
  try {
    const advs = await Adv.find({});

    res.status(200).json(advs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = advRouter;
