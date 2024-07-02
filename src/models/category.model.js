import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name can't be null"]
    },
})


const CategoryModel = mongoose.model('category', categorySchema);
export default CategoryModel;