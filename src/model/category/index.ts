import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    icon_image:{
        type: String
    }

})
const Category = mongoose.model('Category', categorySchema);
export default Category;

