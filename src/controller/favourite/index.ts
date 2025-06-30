import { Request, Response } from 'express';
import Business from '../../model/business';
import User from '../../model/customer';
import Favourites from '../../model/favourite';

export interface RequestWithUser extends Request {
  user?: { id: string }
}

export const addFavorite = async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user?.id;
    const { businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({ status: false, message: "businessId is required" });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ status: false, message: "Business not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    let userFavourites = await Favourites.findOne({ userId });

    if (userFavourites) {
     
      if (!userFavourites.businessId.includes(businessId)) {
        userFavourites.businessId.push(businessId);
        await userFavourites.save();
      }
    } else {
      userFavourites = await Favourites.create({
        userId,
        businessId: [businessId]
      });
    }

    return res.status(200).json({
      status: true,
      message: "Added to favorites successfully",
      data: userFavourites
    });
  } catch (error: any) {
    console.error("addFavorite error:", error);
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};

export const getFavorites = async (req: RequestWithUser, res: Response) => {
    try {
      const userId = req.user?.id;
  
      if (!userId) {
        return res.status(400).json({ status: false, message: "User ID missing" });
      }
  
    //   const userFavourites = await Favourites.findOne({ userId }).populate('businessId');
    const userFavourites = await Favourites.findOne({ userId });

  
      if (!userFavourites) {
        return res.status(200).json({
          status: true,
          message: "No favorites found",
          data: []
        });
      }
  
      return res.status(200).json({
        status: true,
        message: "Fetched favorites successfully",
        data: userFavourites.businessId 
      });
    } catch (error: any) {
      console.error("getFavorites error:", error);
      return res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
  };
  