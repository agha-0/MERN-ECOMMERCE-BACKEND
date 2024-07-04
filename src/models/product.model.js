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
        required: true,
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
        if (!this.slug || this.isModified('name')) {
            let baseSlug = slugify(this.name, { lower: true });

            // Check if the base slug already exists
            const slugExists = await this.constructor.findOne({ slug: baseSlug });

            if (slugExists) {
                // If base slug already exists, generate a unique suffix
                let suffix = 1;
                let newSlug = `${baseSlug}-${suffix}`;

                // Check if the newly generated slug with suffix exists
                while (await this.constructor.findOne({ slug: newSlug })) {
                    suffix++;
                    newSlug = `${baseSlug}-${suffix}`;
                }

                // Set the unique slug
                this.slug = newSlug;
            } else {
                // If base slug doesn't exist, use it directly
                this.slug = baseSlug;
            }
        }

        next();
    } catch (error) {
        console.error('Error saving product:', error); // Log any errors
        next(error);
    }
});


const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;
