import { Request, Response } from "express";
import Booking from "../../model/booking";
import Business from "../../model/business";

export const createBooking = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    console.log("userId", userId);
    if (!userId) {
        return res.status(404).json({ status: false, message: 'Customer not found' })
    }
    const { booking_location, businessId, booking_datetime, planId, total_amount, tax, final_amount, customer_req, quantity } = req.body;
    try {
        const business = await Business.findById(businessId);
        console.log("BusinessId", businessId)
        if (!business) {
            return res.status(404).json({ status: false, message: 'Business Not found' })
        }

        // const selectedPlan = business.plan.find( p => p.plan._id === planId);
        const selectedPlan = business.plan.find(p => p._id?.toString() === planId);
        console.log("PlanId", planId)
        if (!selectedPlan) {
            return res.status(404).json({
                status: false,
                message: 'Plan not found in business'
            })
        }

        const booking = await Booking.create({
            userId,
            booking_location,
            booking_datetime,
            amount: {
                total_amount,
                tax,
                final_amount,
            },
            customer_req,
            quantity,
            planId,
            businessId: business._id
        });
        return res.status(200).json({
            status: true,
            data: booking
        })
    } catch (err) {
        console.error("booking error:", err);
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
        });
    }
}

export const getBooking = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query: any = {};
        const total = await Booking.countDocuments(query)
        const booking = await Booking.find(query).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            data: booking,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (err: any ) {
        console.error("booking error:", err);
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
        });
    }
}

export const completeBooking = async (req:Request, res:Response) => {
      try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }
        if (booking.status === "CANCELLED") {
          return res.status(400).json({ message: "Cannot complete a cancelled booking" });
        }
        booking.status = "COMPLETED";
        await booking.save();
        res.status(200).json({
          status: true,
          message: "Booking marked as completed",
          data: booking
        });
      } catch (err: any) {
        res.status(500).json({ message: "Something went wrong", error: err.message });
      }
    };

    export const cancelBooking = async(req: Request, res: Response) => {
        try{
            const bookingId = req.params.id;
            const {cancelReason} = req.body;
            if(!bookingId){
                return res.status(404).json({
                    status: false,
                    message:'Booking id not found'
                })
            }
            const booking = await Booking.findById(bookingId);
            if(!booking){
                return res.status(404).json({
                    status: false,
                    message:'Booking not found'
                })
            }
            if( booking.status === 'COMPLETED'){
                return res.status(400).json({
                    status:false,
                    message:'Booking already completed'
                })
            }
            booking.status = 'CANCELLED';
            booking.cancelReason = cancelReason || 'No Reason Found';
            console.log("reason", cancelReason)
            await booking.save();
             return res.status(200).json({
                status:true,
                message:'Succefully Cancelled',
                data: booking
             })

        }catch(err: any){
            res.status(500).json({
                status: false,
                message:'Something went wrong',
                error: err
            })
        }
    }