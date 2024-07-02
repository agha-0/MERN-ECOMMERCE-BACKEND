import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema } = mongoose;

const productSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountedPrice: {
        type: Number,
        min: 0
    },
    image: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to generate unique slug based on product name
productSchema.pre('save', async function (next) {
    try {
        // If slug is not provided or name has changed
        if (!this.slug || this.isModified('name')) {
            let slug = slugify(this.name, { lower: true });

            // Check if the slug already exists in the database
            let slugExists = await this.constructor.findOne({ slug });
            let suffix = 1;

            // Generate a unique slug by appending a suffix if needed
            while (slugExists) {
                slug = `${slug}-${suffix}`;
                slugExists = await this.constructor.findOne({ slug });
                suffix++;
            }

            // Set the slug field
            this.slug = slug;
        }

        next();
    } catch (error) {
        next(error);
    }
});


const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;
