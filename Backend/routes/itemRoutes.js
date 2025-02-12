const express = require('express');
const router = express.Router();
const items = require('../models/Itemmodel');
const users=require('../models/usermodel');
const crypto = require('crypto');
const Razorpay = require('razorpay');

router.get('/mobiles', async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  try {
    const i = await items.find({category:'mobiles'}).skip(skip).limit(limit);
    res.status(200).json(i);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/electronics', async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  try {
    const i = await items.find({category: { $in: ['laptops', 'tablets'] }}).skip(skip).limit(limit);
    res.status(200).json(i);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/cloths', async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  try {
    const i = await items.find({category:'clothing'}).skip(skip).limit(limit);
    res.status(200).json(i);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/accessories', async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  try {
    const i = await items.find({category:'accessories'}).skip(skip).limit(limit);
    res.status(200).json(i);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const item = await items.findOne({_id:id});
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/',async (req,res)=>{
  try {
    const i = await items.aggregate([
      { $sample: { size: 5 } }
    ])
    res.status(200).json(i);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


const razorpayInstance = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET'
});

router.post('/createOrder', async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // Razorpay works in paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: 'order_rcptid_11'
    };
    
    const order = await razorpayInstance.orders.create(options);
    res.json({ order_id: order.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});



router.post('/verifyPayment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
        .createHmac('sha256', 'RAZORPAY_KEY_SECRET')
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

    if (generatedSignature === razorpay_signature) {
        // Payment is successful
        res.status(200).json({ message: 'Payment verified' });
    } else {
        // Payment verification failed
        res.status(400).json({ message: 'Payment verification failed' });
    }
});

// Search route
router.get('/search', async (req, res) => {
    const query = req.query.query || '';

    try {
        const regex = new RegExp(query, 'i'); // 'i' for case-insensitive
        const item = await items.find({
            $or: [{ name: regex }, { slug: regex }]
        });
        res.json(item);
        console.log(regex)
    } catch (error) {
        console.error("Error fetching search results:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;


module.exports = router;

