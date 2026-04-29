import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, customerName, customerEmail, customerPhone, pincode } = req.body;

    const vendorId = items[0]?.vendor; 

    const order = await Order.create({
      user: req.user.id,
      vendor: vendorId || req.body.vendor, 
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      pincode,
      items,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: "Error creating order", error: error.message });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user orders", error: error.message });
  }
};


export const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user.id }).populate("items.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendor orders", error: error.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};


export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      deliveredOrders: 0
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

// --- GET ALL ORDERS (ADMIN) ---
export const getAllOrdersAdmin = async (req, res) => {
  try {
    // Populate both 'vendor' (for business name) and 'user' (for buyer details)
    const orders = await Order.find()
      .populate("vendor", "companyName email phoneNumber") 
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};



// Delete Order (Admin Only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};