const mongoose=require('mongoose')
const { schema } = require('./Itemmodel')
const Schema=mongoose.Schema
const userschema=new Schema({
    name:{
        type:String,
        required:true
    },
    address: {
        type: Array,
        default:''
    },
    mobile: {
        type: Number,
        default: null
    },
    gender: {
        type: String,
        default: null
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
    },
    role: {
        type: Number,
        default: 0,
    }
    
},{timestamps:true})

module.exports=mongoose.model('users',userschema);