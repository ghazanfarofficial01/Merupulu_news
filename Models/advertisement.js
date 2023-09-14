const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const advSchema = mongoose.Schema({
    advTitle:{
        type: String,
        default:"",
        trim: true,
    },
    
    advUrl:{
        type: String,
        default:"",
        trim: true,
    },
    advResourceUrl:{
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
advSchema.plugin(mongoosePaginate);
const Adv = mongoose.model("Adv", advSchema);
module.exports = Adv;
