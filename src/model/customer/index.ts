import mongoose from "mongoose";
import { IUser } from "../../lib/interface/customer";

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true
    },
    user_type: {
      type: String,
      enum: ["CUSTOMER", "PROVIDER"],
      required: true
    },
    email: {
      type: String,
      required: true, unique:
        true
    },
    business_phone: {
      type: String,
      required: true
    },
    whatsapp_phone: {
      type: String,
      required: true
    },
    country: {
      type: String
    },
    password: {
      type: String,
      required: true
    },
    referalSource: {
      type: String,
      enum: ["FRIENDS", "SOCIAL", "AGENT", "OTHERS"],
      required: true
    },
    agent: {
      type: String,
      required: true
    },
    agent_code: {
      type: String,
      required: true
    },
    otp: {
      type: Number
    },
    otpExpires: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    resetPassword: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String
    },
    refreshToken: {
      type: String, // store current refresh token
      default: null
    }
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;


