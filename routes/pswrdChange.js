const express = require("express");

const changePassword = express.Router();
const User = require("../Models/user");
const isAuth = require("../middlewares/isAuth");
const bcryptjs = require("bcryptjs");
changePassword.get("/owner/editCredentials", isAuth, (req, res) => {
  try {
    res.status(200).render("pswrdChange");
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

changePassword.put("/owner/editCredentials", isAuth, async (req, res) => {
  try {
    let email = req.body.email;
    const user = await User.findOne({ email });
    //console.log(user)
    if (!user) {
      return res.status(404).json({ message: "No User Found with this email" });
    }

    if (!user.userType === "owner") {
      return res.status(401).json({ message: "Not an owner" });
    }
    const old_password = req.body.old_password;

    const isMatch = await bcryptjs.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Old password." });
    }
    
    const password = req.body.new_password;
    const hashedPassword = await bcryptjs.hash(password, 8);
    await user.updateOne({ password: hashedPassword });

    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/");
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = changePassword;
