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
      const userCount = await User.countDocuments({userType: 'normalUser'})
      const articles = await News.find({published:true}).limit(10).sort({publishedAt:-1}).exec();

      //console.log(articles);
    res.render("dashboard",{articleCount,userCount,articles})
    } catch(e){
      res.status(500).json({error: e.message})
    }
  })
  //unpushed articles render route
   dashRouter.get('/admin/unpublished',isAuth,async (req,res)=>{
    try{
      const articles = await News.find({published:false}).sort({publishedAt:-1}).exec();
      //console.log(articles)
      res.render("allUnpublished",{articles});
    } catch(e){
      res.status(500).json({error: e.message})
    }
   })
   
   //publishing unpublished articles
   dashRouter.put('/admin/article/publish/:id',isAuth,async(req,res)=>{
    const id = req.params.id;
    const article = await News.findById(id);
    
    const updatedArticle = await News.findByIdAndUpdate(id, { published:true, publishedAt:Date.now()});
    //console.log(updatedArticle);
    res.redirect("/admin/unpublished");
  })


  //all article page render route
  dashRouter.get('/admin/allArticles', isAuth, async (req, res) => {
    try{
      const articles = await News.find({published:true}).sort({publishedAt:-1}).exec();
      //console.log(articles)
      res.render("allArticles",{articles});
    } catch(e){
      res.status(500).json({error: e.message})
    }
   })
  
   //all users page render route
   dashRouter.get('/admin/allUsers', isAuth, async (req, res) => {
    try{
      let users = await User.find({userType: 'normalUser'});
      //console.log(articles)
      if(users<=0){
        users=[]
      }
      res.render("allUsers",{users});
    } catch(e){
      res.status(500).json({error: e.message})
    }
   })
    
//all admins page render route
dashRouter.get('/admin/allAdmins', isAuth, async (req, res) => {
  try{
    const admins = await User.find({userType: 'admin'});
    const user = await User.findById(req.user);
    let userType="";
    
    if(user){
    userType =  await user.userType
    }
    
    //console.log()
    res.render("allAdmins",{admins,userType});
  } catch(e){
    res.status(500).json({error: e.message})
  }
 })
 

 //delete admin
 dashRouter.delete('/admin/delete/:id',isAuth, async (req,res) =>{
  try{
    const {id} = req.params;
     await User.findByIdAndDelete(id);
     res.redirect('/admin/allAdmins');

  } catch(e){
    res.status(500).json({error: e.message})
  }
})


  //add admin
  dashRouter.get("/admin/addAdmin", isAuth,async(req, res) => {
    try{
        const id = req.user;
        const owner = await User.findById(id);
        //console.log(owner.userType);
        if(owner){
        if(owner.userType != "owner"){
          return res
          .status(400)
          .send("Not authorised" );
        }
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
      //console.log(owner.userType);
      if(owner){
      if(owner.userType != "owner"){
        return res
        .status(400)
        .send("Not authorised" );
      }
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

   //article delete route
  dashRouter.delete('/admin/article/:id',isAuth, async (req,res) =>{
    try{
      const {id} = req.params;
       await News.findByIdAndDelete(id);
       res.redirect('/admin/dashboard');
  
    } catch(e){
      res.status(500).json({error: e.message})
    }
  })
  
  //edit articles route
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
    const id = req.params.id;
    const article = await News.findById(id);
    if(req.body.url === ""){
      req.body.url = article.url;
    }
    if(req.body.videoUrl === ""){
      req.body.url = article.videoUrl;
    }
    if(!req.body.isBreaking){
      req.body.isBreaking = false;
    }
    //console.log(req.body.videoUrl);
    const updatedArticle = await News.findByIdAndUpdate(id, { ...req.body });
    //console.log(updatedArticle);
    res.redirect("/admin/dashboard");
  })



  //LOGOUT
  dashRouter.get("/logout",(req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/");
    })
  })
  module.exports = dashRouter;