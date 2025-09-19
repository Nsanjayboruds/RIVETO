
import Order from "../model/orderModel.js"; // ✅ Keep this
import User from "../model/userModel.js";   // ✅ Keep this

import razorpay from 'razorpay'
import dotenv from'dotenv'
dotenv.config()
import crypto from "crypto";
const currency='inr'
const razorpayInstance=new razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET,
})
//for user//
export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const orderData = {
      items,
      amount,
      userId,
      address,
      paymentMethod: 'COD',
      payment: false,
      status: 'Placed',
      date: Date.now()
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    await User.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(201).json({ message: "Order Placed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Order Place error" });
  }
};

export const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId });
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "userOrders error" }); // ❗ Fixed 200 → 500
  }
};


//for admin//
 

export const allOrders =async (req,res)=>{
  try {
    const orders =await Order.find({})
    res.status(200).json(orders)
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"adminAllOrders error"})
    
  }
}


export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    return res.status(201).json({ message: "Status Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const orderData = {
      items,
      amount,
      userId,
      address,
      paymentMethod: 'Razorpay',
      payment: false,
      status: 'Placed',            // ✅ Required field
      date: Date.now()
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString()
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);
    console.log("✅ Razorpay order from backend:", razorpayOrder);

    res.status(200).json(razorpayOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to create Razorpay order" });
  }
};



export const verifyRazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // ✅ Signature verified — mark order as paid
      const razorOrder = await razorpayInstance.orders.fetch(razorpay_order_id);

      await Order.findByIdAndUpdate(razorOrder.receipt, { payment: true });
      await User.findByIdAndUpdate(userId, { cartData: {} });

      return res.status(200).json({ message: "Payment Successful" });
    } else {
      return res.status(400).json({ message: "Invalid Signature. Payment Verification Failed" });
    }
  } catch (error) {
    console.error("❌ Razorpay verify error:", error);
    return res.status(500).json({ message: error.message || "Verification failed" });
  }
};