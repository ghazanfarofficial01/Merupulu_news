const mongoose = require('mongoose')
const GalleryUploadSchema = mongoose.Schema({
    name:{
        type: String,
        default:"",
        trim: true,
    },
    
    url:{
        type: String,
        default:"",
        trim: true,
        
    },
   
    videoUrl:{
        type: String,
        default:"",
        trim: true,
       
    },

    publishedAt:{
      type: Date,
      default: Date.now(),
    }
})

const Gallery = mongoose.model("Gallery", GalleryUploadSchema);
module.exports = Gallery;