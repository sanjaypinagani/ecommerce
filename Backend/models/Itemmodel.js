const mongoose=require('mongoose')
const Schema=mongoose.Schema
const itemSchema=new Schema({
    name:{
        type:String,
        required:true
        },
    price:{
        type:Number,
        required:true
        },
    description:{
        type:String,
        required:true
        },
    image:{
        type:String,
        required:true
        },
    beforePrice:{
        type:Number,
        required:true
        },
    slug:{
        type: String,
        required: true,
        },
    category: {
        type: String,
        required: true,
        }
});

module.exports=mongoose.model('Item',itemSchema);