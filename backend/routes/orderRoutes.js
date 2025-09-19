import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { allOrders, placeOrder, placeOrderRazorpay, updateStatus, userOrders, verifyRazorpay } from '../controller/orderController.js';
import adminAuth from '../middleware/adminAuth.js';


const orderRoutes = express.Router()


orderRoutes.post("/placeorder",isAuth,placeOrder)
orderRoutes.post("/razorpay",isAuth,placeOrderRazorpay)
orderRoutes.post("/userorder",isAuth,userOrders)
orderRoutes.post("/verifyrazorpay",isAuth,verifyRazorpay)



orderRoutes.post("/list",adminAuth,allOrders)
orderRoutes.post("/status",adminAuth,updateStatus)


export default  orderRoutes;