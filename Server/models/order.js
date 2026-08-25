const mongo =require("mongoose");

const orderschema = mongo.Schema({
    customerName:{
        type:String,
        required:true,
        trim:true
    },
    items:[{
        product:{
            type: mongo.Schema.Types.ObjectId,
            ref:"product",},
        price:{
                type:Number,
                required:true
            },
        quantity:{
                type:Number,
                required:true
            }}],
    totalAmount:{
                type:Number,
                required:true
            },
    status:{
                type:String,
                enum:["pending","completed","cancelled"],
                default:"pending"
            }
},{
    timestamps:true
})
const ordermodel = mongo.model("order",orderschema);
module.exports= ordermodel;