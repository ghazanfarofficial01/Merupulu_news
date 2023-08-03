const mongoose = require('mongoose')
const newsSchema = mongoose.Schema({
    title:{
        type: String,
        retquired: true,
        trim: true,
    },

    category:{
      type: String,
      default: "",
      trim: true,
    },
    
    url:{
       type: String,
       default: ""
    },

    content:{
        type: String,
        default: ""
    },
   
    source:{
        type: String,
        default: ""
    },
    description:{
        type: String,
        required:true,
        trim: true
    },

    author:{
        type: String,
        default: ""
    },
    publishedAt:{
        type: Date,
        default: Date.now
    }


})

const NewsArticles = mongoose.model("NewsArticles",newsSchema);
module.exports = NewsArticles;