import { Request, Response } from "express";
import Business from "../../model/business";


export interface RequestWithUser extends Request {
    user: {
        id: string;
    };
}

export const createBusiness = async (req: RequestWithUser, res: Response) => {
    const  userId  = req.user?.id;
    const { provider_type,
        business_name,
        description,
        offer_type,
        document_id,
        longitude,
        latitude,
        place_number,
        floor,
        street,
        landmark,
        days,
        isOpen24Hours,
        isClosed,
        openTime,
        closeTime,
        plan_name,
        plan_price,
        plan_description,
        isNegotiable,
        category,
        subcategory
    } = req.body;

    if (!userId || !provider_type || !business_name || !offer_type) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
    }

    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const documentUrls = files?.documents?.map(file => file.path) || [];
        const businessImageUrls = files?.businessImage?.map(file => file.path) || [];
        const flayerImage = files?.flayer?.[0]?.path || "";
        // const files = req.files as Express.Multer.File[];
        // const documentUrls = (files["documents"] || []).map(file => `/uploads/business_documents/${file.filename}`);
        // const businessImageUrls = (files["businessImage"] || []).map(file => `/uploads/business_images/${file.filename}`);
        // const flayerImage = files["flayer"]?.[0] ? `/uploads/flyers/${files["flayer"][0].filename}` : "";

        const locationDetails = {
            place_number,
            street,
            floor,
            landmark
        }
        const location = {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
        }

        const timing: any[] = [];
        if (Array.isArray(days)) {
            for (let i = 0; i < days.length; i++) {
                timing.push({
                    days: days[i],
                    isOpen24Hours: isOpen24Hours?.[i] === 'true',
                    isClosed: isClosed?.[i] === 'true',
                    openTime: openTime?.[i] || '',
                    closeTime: closeTime?.[i] || ''
                });
            }
        } else if (days) {
            timing.push({
                days,
                isOpen24Hours: isOpen24Hours === 'true',
                isClosed: isClosed === 'true',
                openTime: openTime || '',
                closeTime: closeTime || '',
            })
        }

        const planImageFiles = files["plan_image"] || [];
        let plans: any[] = [];

        if (Array.isArray(plan_name)) {
            for (let i = 0; i < plan_name.length; i++) {
                plans.push({
                    plan_name: plan_name[i],
                    plan_price: plan_price?.[i] || "",
                    plan_description: plan_description?.[i] || "",
                    // plan_image: planImageFiles?.[0] ? `/uploads/plan_images/${planImageFiles[0].filename}` : "",
                    plan_image: planImageFiles?.[i]?.path || "",
                    isNegotiable: isNegotiable?.[i] === 'true'
                });
            }
        } else if (plan_name) {
            plans.push({
                plan_name,
                plan_price,
                plan_description,
                // plan_image: planImageFiles?.[0] ? `/uploads/plan_images/${planImageFiles[0].filename}` : "",
                plan_image: planImageFiles?.[0]?.path || "",
                isNegotiable: isNegotiable === 'true'
            });
        }

        const business = await Business.create({
            provider_type,
            business_name,
            description,
            offer_type,
            userId,
            business_documents: {
                documents: documentUrls,
                document_id: document_id || "",
            },
            location,
            locationDetails,
            businessImage: businessImageUrls,
            flayer: flayerImage,
            timing,
            plan: plans,
            service:{
                category,
                subcategory: Array.isArray(subcategory) ? subcategory : [subcategory]
            }
            
        });

        return res.status(201).json({
            status: true,
            message: 'Business Created Successfully',
            data: business
        });
    }
    catch (err) {
        console.error("Create business error:", err);
        return res.status(500).json({ status: false, message: "Something went wrong" });
    }
}


export const getBusiness = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string)?.trim() || "";

        const query: any = {};

        if (search) {
            query.$or = [
                { business_name: { $regex: search, $options: "i" } },
            ];
        }

        const total = await Business.countDocuments(query);
        const businesses = await Business.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 }); 

        return res.status(200).json({
            status: true,
            message: "Fetched businesses successfully",
            data: businesses,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error("get business error:", err);
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
        });
    }
};




