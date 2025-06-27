import mongoose, { Types } from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessId: {
        type: Types.ObjectId,
        ref: "Business",
        required: true
    },
    planId: {
        type: String,
        required: true
    },
    booking_location: {
        type: String
    },
    amount: {
        total_amount: { type: String },
        final_amount: { type: String },
        tax: { type: String },
    },
    customer_req: {
        type: String
    },
    booking_datetime: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "REJECTED", "ACCEPTED","CANCELLED"],
        default: 'PENDING'
    },
    cancelReason:{
      type: String,  
    },
})
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;


