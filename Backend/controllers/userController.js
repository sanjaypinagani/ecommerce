const carts=require('../models/cartmodel')
const items = require('../models/Itemmodel');
const orders=require('../models/ordermodel');

const getOrdersController=async(req,res)=>{
    try{
    const user_id=req.session.userID;
    if (!user_id) {
        res.status(401).json({ message: 'Please login first' });
        console.log('Please login first');
        return;
    }
    let order= await orders.findOne({user:user_id}).populate('items.item')
    if(!order){
        order=await orders.insertMany({user:user_id})
        res.status(200).json(order)
        return;
    }
    res.status(200).json(order)
    console.log('fetched orders')
    }catch(err){
        console.log(err)
    }
}

module.exports = { getOrdersController };