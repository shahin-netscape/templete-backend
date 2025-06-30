import {Request, Response} from  'express';
import Reviews from '../../model/reviews';
import Booking from '../../model/booking';

export interface RequestWithUser extends Request {
  user?: {
    id: string
  }
}

export const submitReview = async (req:RequestWithUser, res:Response) => {
  try {
    const { bookingId, rating, comment, } = req.body;
    const userId = req.user?.id;
    console.log("userId", userId);
    console.log("bookingId from body:", bookingId);

    const booking = await Booking.findById(bookingId);
    // console.log("found booking:", booking);

    const mediaUrls = (req.files as Express.Multer.File[] || []).map(file => file.path);
    console.log("mediaUrls", mediaUrls);

    if(!booking || booking.status !== "COMPLETED") {
      return res.status(400).json({ message: "Only completed bookings can be reviewed" });
    }

    const alreadyReviewed = await Reviews.findOne({ bookingId: bookingId, userId: userId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already submitted a review for this booking." });
    }

    const review = new Reviews({
      userId: userId,
      // businessId: booking.businessId, 
      businessId: booking.businessId?._id ?? booking.businessId, 
      bookingId: booking._id,
      rating,
      comment,
      media: mediaUrls
    });
    await review.save();

    res.status(201).json({
      status: true,
      message: "Review submitted successfully",
      data: review
    });
  } catch (error: any) {
    console.error("submitReview error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBusinessReviews = async (req:Request, res:Response) => {
    try{
      const {businessId} = req.params;
      const reviews = await Reviews.find({businessId}).populate('userId', 'username')
    res.status(200).json({ status: true, message: "Fetched successfully", data: reviews });

    }catch(error: any){
      console.error("submitReview error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
    }
}
