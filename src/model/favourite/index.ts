import mongoose, {Types} from "mongoose";

const favouritesSchema = new mongoose.Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    },
    businessId: {
        type: [Types.ObjectId],
        required: true,
        ref: 'Business'
    },
});

module.exports = mongoose.model("Favourites", favouritesSchema);