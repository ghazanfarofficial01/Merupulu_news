const mongoose = require('mongoose')
const eventSchema = mongoose.Schema({
    eventTitle:{
        type: String,
        default:"",
        trim: true,
    },
    
    eventUrl:{
        type: String,
        default:"",
        trim: true,
    },
    eventResourceUrl:{
        type: String,
        default:"",
        trim: true,
        required:true
    },

    publishedAt:{
      type: Date,
      default: Date.now,
    }
})

const Events = mongoose.model("Events", eventSchema);
module.exports = Events;