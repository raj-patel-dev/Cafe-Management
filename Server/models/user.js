const mongo = require("mongoose");

const userchema = mongo.Schema({
   name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true,
    unique:true
   },
   password:{
    type:String,
    required:true
   },
   role:{
    type:String,
    enum:["admin","staff"],
    default:"staff"
   }
})
const usermodel = mongo.model("user",userchema);
module.exports = usermodel;
