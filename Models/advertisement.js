const mongoose = require('mongoose')
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
    }

    

})

const Adv = mongoose.model("Adv", advSchema);
module.exports = Adv;