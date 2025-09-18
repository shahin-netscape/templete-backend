import mongoose, { Types } from "mongoose";
import { IBusiness } from "../../lib/interface/business";

const businessSchema = new mongoose.Schema<IBusiness>({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider_type: {
        type: String,
        enum: ["INDIVIDUAl", "BUSINESS"],
        required: true
    },
    business_name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    offer_type: {
        type: String,
        enum: ["HOME VISIT", "LOCATION", "HYBRID"],
        required: true
    },
    business_documents: {
        type: {
            documents: [String],
            document_id: String
        },
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    locationDetails: {
        place_number: {
            type: String
        },
        floor: {
            type: String
        },
        street: {
            type: String
        },
        landmark: {
            type: String
        },
    },
    businessImage: {
        type: [String]
    },
    flayer: {
        type: String
    },
    timing: [
        {
            days: { type: String, enum: ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] },
            isOpen24Hours: { type: Boolean },
            isClosed: { type: Boolean },
            openTime: { type: String },
            closeTime: { type: String },
        }
    ],
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },
    service:{
        category:{
            type: Types.ObjectId,
            ref:'Category',
            required: true
        },
        subcategory:[{
            type: Types.ObjectId,
            ref:'Subcategory'
        }]
    },
    plan: [{
        plan_name: { type: String },
        plan_price: { type: String },
        plan_description: { type: String },
        plan_image: { type: String },
        isNegotiable: {
            type: Boolean,
            default: false
        }
    }
    ]
},
    { timestamps: true },
);
businessSchema.index({ 'location.coordinates': '2dsphere' });

const Business = mongoose.model("Business", businessSchema);
export default Business;
