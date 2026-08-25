const mongo = require("mongoose");

const productschema = mongo.Schema({
    name:{type:String,
        required:true,
        trim:true
    },
    cetegory:{type: mongo.Schema.Types.ObjectId,
        ref:"category",
        required:true
    },
    price:{type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    iaAvailable:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})
const productmodel = mongo.model("product",productschema);
module.exports = productmodel;