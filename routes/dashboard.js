const express = require('express');
const bcryptjs = require('bcryptjs');
const dashRouter = express.Router();
const isAuth = require('../middlewares/isAuth')
const mongoose = require('mongoose');
const News = require("../Models/articles")
const User = require('../Models/user');



dashRouter.get('/admin/dashboard',isAuth, async(req, res) => {
    try{
      const articleCount = await News.countDocuments({})
      const userCount = await User.countDocuments({})
      const articles = await News.find({}).limit(10).exec();

      //console.log(articles);
    res.render("dashboard",{articleCount,userCount,articles})
    } catch(e){
      res.status(500).json({error: e.message})
    }
  })
  
  //all article page render route
  dashRouter.get('/admin/allArticles', isAuth, async (req, res) => {
    try{
      const articles = await News.find({}).sort({publishedAt:-1}).limit(10).exec();
      //console.log(articles)
      res.render("allArticles",{articles});
    } catch(e){
      res.status(500).json({error: e.message})
    }
   })
  //add admin
  dashRouter.get("/admin/addAdmin", isAuth,async(req, res) => {
    try{
        const id = req.user;
        const owner = await User.findById(id);
        console.log(owner.userType);
        if(owner.userType != "owner"){
          return res
          .status(400)
          .send("Not authorised" );
        }
       res.render("addAdmin");
    }catch(e){
      res.status(500).json({error: e.message})
    }
  })
   
  dashRouter.post("/admin/addAdmin", isAuth,async(req, res) => {
    try{
      //console.log(req.user);
      const id = req.user;
      const owner = await User.findById(id);
      console.log(owner.userType);
      if(owner.userType != "owner"){
        return res
        .status(400)
        .send("Not authorised" );
      }
       let {name,email,password} = req.body;
       const hashedPassword = await bcryptjs.hash(password, 8);
       let user = new User({
         name,
         email,
         password:hashedPassword,
         userType: "admin"
       })
       user = await user.save()
       res.redirect('/admin/dashboard');
    }catch(e){
      res.status(500).json({error: e.message})
    }
  })


  dashRouter.delete('/admin/article/:id',isAuth, async (req,res) =>{
    try{
      const {id} = req.params;
       await News.findByIdAndDelete(id);
       res.redirect('/admin/dashboard');
  
    } catch(e){
      res.status(500).json({error: e.message})
    }
  })
  
  dashRouter.get("/admin/article/:id/edit",isAuth, async (req, res) => {
     try{
        const article = await News.findById(req.params.id)
        if(!article){
          return res.status(404).json({message:"Not Found"})
        }

        res.render("editArticle",{article});
     }catch(e){
      res.status(500).json({error: e.message})
     }
  })
  
  dashRouter.put('/admin/article/:id',isAuth,async(req,res)=>{

    const article = await News.findById(req.params.id);
    console.log(req.body.url)
    res.send(req.body);
  })

  //LOGOUT
  dashRouter.get("/logout",(req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/");
    })
  })
  module.exports = dashRouter;