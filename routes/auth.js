if (process.env.NODE_ENV !== "production") require('dotenv').config();
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const authRouter = express.Router();
//const session = require('session');
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password,userType = "normalUser" } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
      email,
      password: hashedPassword,
      name,
      userType
    });
    user = await user.save();

    //const id = user._id.valueOf();

    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//app signin
authRouter.post("/api/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ msg: "User with this email does not exist!" });
      }
  
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password." });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.jwt_secret);
      
      res.json({ token, ...user._doc }); 
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  //dashboard signin
  authRouter.get('/', (req,res)=>{
    res.render("login")
  })

  authRouter.post("/admin/signin", async (req, res) => {
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
      res.redirect('/admin/dashboard');
      //res.json({ token, ...user._doc }); 
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });


  //for admin signin in the mobile app
  authRouter.get("/admin/app/signin", async (req, res) => {
    try {
      const { email, password } = req.query;
  
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
      res.redirect('/admin/dashboard');
      //res.json({ token, ...user._doc }); 
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

module.exports = authRouter