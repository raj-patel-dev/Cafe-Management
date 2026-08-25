const mongo = require("mongoose");

const categoryschema = mongo.Schema({
    name:{type:String,
        required:true,
        unique:true,
        trim:true
    }
},{
    timestamps:true
})
const categorymodel = mongo.model("category",categoryschema);
module.exports = categorymodel;
