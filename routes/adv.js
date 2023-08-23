const express = require("express");
const advRouter = express.Router();
const isAuth = require("../middlewares/isAuth");
const Adv = require("../Models/advertisement");


//all adv page render route
advRouter.get("/admin/allAdvertisements", isAuth, async (req, res) => {
  try {
    const advs = await Adv.find({}).sort({publishedAt:-1}).exec();
    res.render("allAds",{advs});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


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


//deleting an advertisement
advRouter.delete('/admin/adv/:id',isAuth, async (req,res) =>{
  try{
    const {id} = req.params;
    console.log(id);
     await Adv.findByIdAndDelete(id);
     res.redirect('/admin/allAdvertisements');

  } catch(e){
    res.status(500).json({error: e.message})
  }
})


//to fetch advertisement for mobile application
advRouter.get("/api/getAdvertisements", async (req, res) => {
  try {
    const advs = await Adv.find({}).sort({publishedAt:-1}).exec();

    res.status(200).json(advs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = advRouter;
