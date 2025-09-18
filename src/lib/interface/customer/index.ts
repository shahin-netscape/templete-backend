import { Document, Types } from "mongoose";

export interface IUser extends Document {
  id: string
  username: string;
  user_type: string;
  email: string;
  business_phone: string;
  whatsapp_phone: string;
  country: string;
  password: string;
  referalSource: string;
  agent: string;
  agent_code: string;
  otp?: number;
  otpExpires?: string;
  isVerified: boolean;
  resetPassword: boolean;
  verificationToken?: string;
  refreshToken?: string;
}

