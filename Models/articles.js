const mongoose = require('mongoose')
const newsSchema = mongoose.Schema({
    isBreaking:{
       type:Boolean,
       default:false,
       required:true
    },

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
       trim: true,
       default: ""
    },
    
    videoUrl:{
        type: String,
        trim: true,
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
        trim: true
    },

    author:{
        type: String,
        default: ""
    },
    publishedAt:{
        type: Date,
        default: Date.now
    },
    published:{
        type:Boolean,
        default: false,
    }


},
{timestamps:true})

const NewsArticles = mongoose.model("NewsArticles",newsSchema);
module.exports = NewsArticles;
