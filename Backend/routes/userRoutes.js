const express = require('express');
const router = express.Router();
const users=require('../models/usermodel');
const {comparePassword}=require('./hashpassword')
const {hashedPassword}=require('./hashpassword')
const carts=require('../models/cartmodel')
const items = require('../models/Itemmodel');
const orders=require('../models/ordermodel');
const sendEmail=require('../controllers/emailService')

router.post('/login',async(req,res)=>{
  try{
    const {email,password}=req.body;
    const user=await users.findOne({email})
    if (!user){
      res.status(404).json({message:'user not found'});
      console.log('404')
    }
    else{
      const isMatch=await comparePassword(password,user.password)
      if(isMatch){
        req.session.userId=user._id;
        res.status(200).json(req.sessionID);
        console.log('userid:',req.session.userId);
        console.log('login  success')
      }
      else{
        res.status(201).json({message:'incorrect username or password'});
        console.log('201')
      }
    }
  }catch(err){
    console.log(err)
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/signin', async (req, res) => {
  try {
    const { name, email, mobile, password, gender } = req.body;
    const user = await users.findOne({ email });
    if (user) {
      res.status(409).json({ message: 'Already a user' });
    } else {
        const hpassword= await hashedPassword(password)
      await users.insertMany({ name, email, mobile, password:hpassword, gender });
      res.status(200).json({ message: 'User created successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/cart', async (req, res) => {
  try{
    const { id } = req.body;
    console.log(id)
    const user_id = req.session.userId; // Ensure you have the correct path for user ID in session
    if (!user_id) {
      res.status(401).json({ message: 'Please login first' });
      console.log('Please login first');
      return;
    }
    
    const item = await items.findById( id );
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      console.log('Item not found');
      return;
    }
    
    let cart = await carts.findOne({user:user_id});
    if (!cart) {
      cart = new carts({ user:user_id, items: [{ item: item._id, quantity: 1 }] });
      await cart.save();
      res.status(200).json({ message: 'Item added to cart' });
      console.log( 'Item added to cart')
    } else {
      let isItemExist = false;

      for (let cartItem of cart.items) {
        if (cartItem.item && cartItem.item.toString() === item._id.toString()) {
          isItemExist = true;
          cartItem.quantity += 1;
          break; // Exit loop since item is found
        }
      }

      if (isItemExist) {
        isItemExist.quantity += 1;
        isItemExist=false;
        console.log('quantity increased')
      } else {
        cart.items.push({ item: item._id, quantity: 1 });
        console.log('item added')
      }
      await cart.save();
      res.status(200).json({ message: isItemExist ? 'Item quantity increased' : 'Item added to cart' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/logout',async(req,res)=>{
  try{
    req.session.destroy();
    console.log('logout success')
    res.status(200).json({message:'loggedout'})
  }catch(err){
    console.log(err)
  }
})

router.get('/cart',async(req,res)=>{
  try {
    const user_id = req.session.userId; // Ensure you have the correct path for user ID in
    if (!user_id) {
      res.status(401).json({ message: 'Please login first' });
      console.log('Please login first');
      return;
    }else{
      var cart = await carts.findOne({ user:user_id });
      if (!cart) {
        var cart=await carts.insertMany({user:user_id});
        var cart=await carts.findOne({ user:user_id });
        res.status(200).json(cart);
        console.log('Cart found');
        } else {
          const cart = await carts.findOne({user:user_id}).populate('items.item')
          console.log('cart found')
            res.status(200).json(cart);
            }
    }
  }catch(err){
    console.error(err);
  }
})
router.delete('/cart',async(req,res)=>{
  try{
    const user_id = req.session.userId; // Ensure you have the correct path for user ID in
    if (!user_id) {
      res.status(401).json({ message: 'Please login first' });
      return;
    }else{
      const {id} = req.body;
      const cart=await carts.findOneAndUpdate({user:user_id},{$pull:{items:{item:id}}},{new:true}).populate('items.item')
      res.status(200).json(cart);
      console.log('item removed')

    }
  }catch(err){
    console.error(err);
  }
})

router.put('/cart',async(req,res)=>{
  try{
    const user_id = req.session.userId; // Ensure you have the correct path for user ID in
    const {id,type} = req.body;

    if(!user_id){
      res.status(401).json({ message: 'Please login first' });
      return;
    }
    let cart=await carts.findOne({user:user_id})
    const index=cart.items.findIndex(cartItem=>cartItem.item.toString()===id.toString())
    if (index === -1) {
      res.status(404).json({ message: 'Item not found in cart' });
      return;
    }
    if (type === 'add') {
      cart.items[index].quantity += 1;
    }else{
      if (cart.items[index].quantity > 1) {
        cart.items[index].quantity -= 1;
      } else {
        cart.items.splice(index, 1); // Remove the item if quantity is 1 or less
      }
    }
    cart = await cart.save();
    const new_cart=await carts.findOne({user:user_id}).populate('items.item') // Re-populate the items
    res.status(200).json(new_cart);
    }catch(err){
      console.log(err)
    }
})

router.get('/orders',async(req,res)=>{
  try{
  const user_id=req.session.userId;
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
)

router.post('/send-email', (req, res) => {
  const { email, subject, text } = req.body;
  sendEmail(email, subject, text);
  res.send('Email sent');
});


router.get('/profile',async(req,res)=>{
  try{
    const user_id=req.session.userId;
    if (!user_id) {
        res.status(401).json({ message: 'Please login first' });
        console.log('Please login first');
        return;
    }
    let user= await users.findOne({_id:user_id})
    
    res.status(200).json(user)
    }catch(err){
        console.log(err)
    }
});
router.post('/profile',async(req,res)=>{
  try{
    const user_id=req.session.userId;
    const data=req.body
    if (!user_id) {
        res.status(401).json({ message: 'Please login first' });
        console.log('Please login first');
        return;
    }
    const user = await users.findByIdAndUpdate(user_id, data, {
      new: true, // Return the updated document
      runValidators: true // Ensure validators are run on the update
    });
    
    res.status(200).json(user)
    console.log('fetched orders')
    }catch(err){
        console.log(err)
    }
})
module.exports = router;
