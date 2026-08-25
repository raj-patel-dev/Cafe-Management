const mongo = require("mongoose");

const inventoryschema = mongo.Schema({
    itemName:{type:String,
        required:true,
        trim:true
    },
    quantity:{
        type:Number,
        required:true
    },
    unit:{
        type:String,
        default:"pcs"
    },
    minimumStock:{
        type:Number,
        default:5
    }
},{
    timestamps:true
})
const inventorymodel = mongo.model("inventory",inventoryschema);
module.exports = inventorymodel;