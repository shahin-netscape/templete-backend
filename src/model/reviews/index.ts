import mongoose, { Types } from "mongoose";

const reviewShema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessId: {
    type: Types.ObjectId,
    ref: 'Business',
    required: true
  },
  bookingId: {
    type: Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    type: String,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
  },
  media: {
    type: [String]
  }
})
const Reviews = mongoose.model('Reviews', reviewShema);
export default Reviews;
