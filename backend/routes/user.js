var express = require('express');
var router = express.Router();
const UserModel = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const JWT_SECRET = "hungdz2002"

router.post('/register', async(req, res) =>{
  const{fname, lname, email, password, userType} = req.body

  const encryptedPassword = await bcrypt.hash(password, 10) //10: do dai cua hash

  try {
    const oldUser = await UserModel.findOne({email})
    if(oldUser){
      return res.json({ error : "Email Exists"})
    }
    await UserModel.create({
      fname, 
      lname, 
      email,
      password: encryptedPassword, //save encrypted password vao db
      userType
    })
    res.send({status: "ok"})
  } catch (error) {
    res.send({status: "error"})
  }
});

router.post("/login-user", async(req, res)=>{
  const{email, password} = req.body
  console.log(req.body)
  const user = await UserModel.findOne({email})
  if(!user){
    return res.json({error: "User not found"})
  }
  if(await bcrypt.compare(password, user.password)){
    const token = jwt.sign({email:user.email, userId: user._id}, JWT_SECRET, {
      expiresIn: 900
    })

    if(res.status(201)){
      return res.json({status: "ok", data: { token, userId: user._id }})
    }
    else{
      return res.json({status:"error", error:"Invalid password"})
    }
  }
})

router.post("/userData", async(req, res)=>{
  const {token} = req.body
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res)=>{
      if (err){
        return "token expired"
      }
      return res
    })
    if(user == "token expired"){
      return res.send({status:"error", data:"token expired"})
    }
    const useremail = user.email
    UserModel.findOne({email: useremail})
    .then((data) => {
      res.send({status:"ok", data:data})
    })
    .catch((error)=>{
      res.send({status: "error", data: error})
    })
  } catch (error) {
    
  }
})

//Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;//correct
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      // alert("You haven't logged in yet")
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.email = decoded.email; // Corrected property name to 'email'
    next();
  });
};

//Add to cart

const CartModel = require('../models/CartModel')
const ToyModel = require('../models/ToyModel')

router.post('/cart',verifyToken, async (req, res) => {
  try {
    console.log(req.body)
    const  productId  = req.body.productId;
    console.log(productId)
    const  userId  = req.body.userId
    console.log(userId)
    // Check if product exists
    const product = await ToyModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has a cart
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      // Create a new cart for the user if it doesn't exist
      const newCart = new CartModel({ user: userId, products: [productId] });
      await newCart.save();
    } else {
      // Add product to the existing cart
      cart.products.push(productId);
      await cart.save();
    }

    res.status(200).json({ message: 'Product added to cart' });
  } catch (error) {
    console.log('Add to cart error:', error);
    res.status(500).json({ message: 'Add to cart failed' });
  }
})

// Retrieve cart
router.get('/cart',verifyToken, async (req, res) => {
  try {
    const userId = req.query.userId;
    const cart = await CartModel.findOne({ user: userId }).populate('products');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.log('Retrieve cart error:', error);
    res.status(500).json({ message: 'Retrieve cart failed' });
  }
});

//Delete from cart
router.delete('/cart/:productId', verifyToken, async (req, res) => {
  try {
    console.log(req)
    const userId = req.query.userId;
    const productId = req.params.productId;
    // Find the user's cart
    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove all occurrences of the product from the cart
    cart.products = cart.products.filter((product) => product.toString() !== productId);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
    console.log('Remove from cart error:', error);
    res.status(500).json({ message: 'Remove from cart failed' });
  }
});

//Payment
const PaymentModel = require('../models/PaymentModel')

router.post('/payment', async(req, res) => {
  const { userId, products } = req.body;

  const payment = new PaymentModel({ userId, products });

  try {
    await payment.save();
    // Delete all items in the cart for the given user
    await CartModel.deleteMany({ userId });
    
    res.status(200).json({ message: 'Payment successful' });
  } catch (error) {
    console.error('Payment save error:', error);
    res.status(500).json({ message: 'Payment failed' });
  }
});

//Display all payments
router.get('/payments', async (req, res) => {
  try {
    // Fetch all payments from the database
    // const payments = await PaymentModel.find().populate('products');
    // console.log(payments)
    const payments = await PaymentModel.find()
    // console.log(payments)
    res.json({ payments });
  } catch (error) {
    console.error('Fetch payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});




module.exports = router;
