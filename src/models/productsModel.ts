import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		category: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		quantity: {
			type: Number,
			default: 1
		},
		description: {
			type: String,
			required: true
		},
		images: {
			image1: {
				type: String,
				required: true
			},
			image2: {
				type: String,
				default: ""
			},
			image3: {
				type: String,
				default: ""
			}
		}
	},
	{
		timestamps: true
	}
);

const productsModel = mongoose.model("Products", productSchema);

export default productsModel;
