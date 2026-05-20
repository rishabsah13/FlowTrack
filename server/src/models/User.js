import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },

    // subscription fields
    subscriptionPlan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
    subscriptionStatus: { type: String, enum: ["inactive", "active"], default: "inactive" },
    subscriptionRazorpayPaymentId: { type: String },
    subscriptionRazorpayOrderId: { type: String }
  },
  { timestamps: true }
);


export const User = mongoose.model("User", userSchema);