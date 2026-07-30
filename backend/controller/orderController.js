import Order from "../model/orderModel.js"; // ✅ Keep this
import User from "../model/userModel.js"; // ✅ Keep this
import {
  sendNotification,
  emitActivity,
} from "../services/notificationService.js";
import logger from "../config/logger.js";

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
      paymentMethod: "COD",
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

    return res.status(201).json({ message: "Order Placed" });
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
    }); // ❗ Fixed 200 → 500
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