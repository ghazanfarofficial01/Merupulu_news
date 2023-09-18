const express = require("express");
const mongoose = require("mongoose");
const reporterRouter = express.Router();
const News = require("../Models/articles");
const isAuth = require("../middlewares/reporterAuth")
if (process.env.NODE_ENV !== "production") require('dotenv').config();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");

reporterRouter.get("/reporter/newNews", isAuth, (req, res) => {
    const successMessage = req.flash('success');
  res.render("newArticlebyReporter",{successMessage});
});

reporterRouter.post("/reporter/newNews",isAuth, async (req, res) => {
  try {
    const { title, url, videoUrl ,category,district, content = "",source="", desc = "", author = "" , isBreaking = true } = req.body;
   
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
      reporter:req.user,
    });
     
    news = await news.save();
    req.flash('success', 'Article posted successfully!');
    
    res.redirect("/reporter/newNews");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


reporterRouter.get('/reporter/signin', (req,res)=>{
    res.render("reporterLogin")
  })

//signin for reporter
reporterRouter.post("/reporter/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        req.session.error = "Invalid Credentials";
        return res
          .status(400)
          .send("User with this email does not exist!" );
      }
      
      if (!(user.userType==="owner" || user.userType==="admin")) {
        req.session.error = "Invalid Credentials";
        return res
          .status(400)
          .send("Not authorised" );
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        req.session.error = "Invalid Credentials";
        return res.status(400).json({ msg: "Incorrect password." });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.jwt_secret);
      req.session.token = token;
      res.redirect('/reporter/newNews');
      //res.json({ token, ...user._doc }); 
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  //LOGOUT
  reporterRouter.get("/reporter/logout",(req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/reporter/signin");
    })
  })

module.exports = reporterRouter;
