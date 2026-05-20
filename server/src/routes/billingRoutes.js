import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { authRequired } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";
const router = express.Router();

// helper to create Razorpay instance when needed
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Simple plan config (amounts in INR)
const PLANS = {
  basic: { amount: 499, plan: "Starter" }, // ₹499
  growth: { amount: 999, plan: "Growth" }, // ₹999
  enterprise: { amount: 1999, plan: "Enterprise" }, // ₹1999
};

// POST /api/billing/create-order
router.post("/create-order", authRequired, async (req, res) => {
  try {
    const { planKey } = req.body;
    const planConfig = PLANS[planKey];

    if (!planConfig) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    const razorpay = getRazorpayInstance();
    const shortUserId = req.user.userId.toString().slice(-6); // last 6 chars of ObjectId
    const shortTime = Date.now().toString().slice(-6); // last 6 digits of timestamp
    const options = {
      amount: planConfig.amount * 100,
      currency: "INR",
      receipt: `rcpt_${shortUserId}_${shortTime}`, // well under 40 chars
      notes: {
        userId: req.user.userId.toString(),
        plan: planConfig.plan,
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: planConfig.plan,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Unable to create order" });
  }
});

// POST /api/billing/verify
router.post("/verify", authRequired, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // Mark user as subscribed
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        subscriptionPlan: plan || "pro",
        subscriptionStatus: "active",
        subscriptionRazorpayOrderId: razorpay_order_id,
        subscriptionRazorpayPaymentId: razorpay_payment_id,
      },
      { new: true },
    ).select("-passwordHash");

    res.json({
      message: "Payment verified and subscription updated",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
