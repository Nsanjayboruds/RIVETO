import crypto from "crypto";
import Order from "../model/orderModel.js"; // ✅ Keep this
import User from "../model/userModel.js"; // ✅ Keep this
import Product from "../model/productModel.js";
import Coupon from "../model/couponModel.js";
import { validateCouponForOrder } from "./couponController.js";
import {
  sendNotification,
  emitActivity,
} from "../services/notificationService.js";
import logger from "../config/logger.js";
import razorpayInstance from "../config/razorpay.js";

//for user//
export const placeOrder = async (req, res) => {
  try {
    const { items, address, couponCode } = req.body;
    const userId = req.userId;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Compute the real order total from actual product prices in the DB.
    // The client's amount (if sent) is never trusted or used.
    const productIds = items
      .map((item) => item.itemId || item._id || item.id)
      .filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    let subtotal = 0;
    for (const item of items) {
      const id = (item.itemId || item._id || item.id)?.toString();
      const product = products.find((p) => p._id.toString() === id);
      if (!product) {
        return res.status(400).json({ message: `Invalid product in order: ${id || 'unknown'}` });
      }
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: `Invalid quantity for ${product.name}` });
      }
      subtotal += product.price * quantity;
    }

    let amount = subtotal;
    let discount = 0;
    let appliedCouponCode = null;

    // Coupon is re-validated here from scratch — never trust a client-side
    // "already validated" claim, since state (usage limit, expiry, active
    // status) can change between the preview call and actual checkout.
    if (couponCode) {
      const result = await validateCouponForOrder(couponCode, subtotal);
      if (!result.valid) {
        return res.status(400).json({ message: result.message });
      }

      // Atomically claim one usage slot. The filter re-checks the usage
      // limit at write time, so two concurrent checkouts racing for the
      // last remaining use can't both succeed.
      const usageFilter = { _id: result.coupon._id };
      if (result.coupon.usageLimit !== null) {
        usageFilter.usageCount = { $lt: result.coupon.usageLimit };
      }
      const claimed = await Coupon.findOneAndUpdate(
        usageFilter,
        { $inc: { usageCount: 1 } },
        { new: true }
      );
      if (!claimed) {
        return res.status(400).json({ message: "This coupon has just reached its usage limit" });
      }

      discount = result.discount;
      amount = result.finalAmount;
      appliedCouponCode = result.coupon.code;
    }

    const orderData = {
      items,
      amount,
      discount,
      couponCode: appliedCouponCode,
      userId,
      address,
      paymentMethod: req.body.paymentMethod || "COD",
      payment: false,
      status: "Placed",
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const user = await User.findById(userId);
    await User.findByIdAndUpdate(userId, { cartData: {} });

    sendNotification({
      isAdmin: true,
      title: "New Order Placed",
      message: `${user ? user.name : "A customer"} has placed an order of $${amount}.`,
      type: "order_placed",
    });

    emitActivity({
      type: "order_created",
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
      },
      action: `Placed an order of $${amount}`,
    });

    return res.status(201).json({ message: "Order Placed", amount, discount });
  } catch (error) {
    logger.error("placeOrder error", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Order Place error",
      errors: [error.message],
    });
  }
};

export const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId });
    return res.status(200).json(orders);
  } catch (error) {
    logger.error("userOrders error", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "userOrders error",
      errors: [error.message],
    });
  }
};

//for admin//
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    logger.error("allOrders error", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "adminAllOrders error",
      errors: [error.message],
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (order) {
      const user = await User.findById(order.userId);

      sendNotification({
        userId: order.userId,
        title: "Order Status Updated",
        message: `Your order status has been updated to "${status}".`,
        type: "order_status_updated",
      });

      emitActivity({
        type: "order_status_updated",
        user: {
          id: user?._id,
          name: user?.name,
          email: user?.email,
        },
        action: `Order status changed to "${status}"`,
      });
    }

    return res.status(201).json({ message: "Status Updated" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      errors: [error.message],
    });
  }
};

// Razorpay Order Creation
export const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, address, couponCode } = req.body;
    const userId = req.userId;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const productIds = items
      .map((item) => item.itemId || item._id || item.id)
      .filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    let subtotal = 0;
    for (const item of items) {
      const id = (item.itemId || item._id || item.id)?.toString();
      const product = products.find((p) => p._id.toString() === id);
      if (!product) {
        return res.status(400).json({ message: `Invalid product in order: ${id || 'unknown'}` });
      }
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: `Invalid quantity for ${product.name}` });
      }
      subtotal += product.price * quantity;
    }

    let amount = subtotal;
    let discount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const result = await validateCouponForOrder(couponCode, subtotal);
      if (!result.valid) {
        return res.status(400).json({ message: result.message });
      }

      const usageFilter = { _id: result.coupon._id };
      if (result.coupon.usageLimit !== null) {
        usageFilter.usageCount = { $lt: result.coupon.usageLimit };
      }
      const claimed = await Coupon.findOneAndUpdate(
        usageFilter,
        { $inc: { usageCount: 1 } },
        { new: true }
      );
      if (!claimed) {
        return res.status(400).json({ message: "This coupon has just reached its usage limit" });
      }

      discount = result.discount;
      amount = result.finalAmount;
      appliedCouponCode = result.coupon.code;
    }

    const orderData = {
      items,
      amount,
      discount,
      couponCode: appliedCouponCode,
      userId,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      status: "Pending",
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    return res.status(201).json({
      success: true,
      order: razorpayOrder,
      orderId: newOrder._id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount,
      discount,
    });
  } catch (error) {
    logger.error("placeOrderRazorpay error", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Razorpay Order creation error",
      errors: [error.message],
    });
  }
};

// Razorpay Payment Verification
export const verifyRazorpay = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.userId;

    const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signBody)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      logger.warn("Razorpay signature verification failed", { orderId, razorpay_order_id });
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Invalid signature",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        payment: true,
        paymentMethod: "Razorpay",
        status: "Placed",
        paymentDetails: {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await User.findByIdAndUpdate(userId, { cartData: {} });
    const user = await User.findById(userId);

    sendNotification({
      isAdmin: true,
      title: "New Order Placed (Razorpay)",
      message: `${user ? user.name : "A customer"} has paid ₹${order.amount} via Razorpay.`,
      type: "order_placed",
    });

    emitActivity({
      type: "order_created",
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
      },
      action: `Paid ₹${order.amount} via Razorpay for order #${order._id}`,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    logger.error("verifyRazorpay error", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Payment verification error",
      errors: [error.message],
    });
  }
};