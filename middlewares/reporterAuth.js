const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    try {
      const token = req.session.token;
      if (!token)
        return res.status(401).redirect('/reporter/signin');
  
      const verified = jwt.verify(token, process.env.jwt_secret);
      if (!verified)
        return res
          .status(401)
          .json({ msg: "Token verification failed, authorization denied." });
  
      req.user = verified.id;
      req.token = token;
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  