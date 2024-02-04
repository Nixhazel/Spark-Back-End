import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { UserInterface } from '../@types/models';

interface UserDocument extends Document, Omit<UserInterface, "_id"> {
	_id: Types.ObjectId;
}
// interface UserDocument extends UserInterface, Document {}

interface UserModel extends Model<UserDocument> {}

const userSchema = new mongoose.Schema<UserDocument, UserModel>(
	{
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		phone: {
			type: String,
			required: true
		},
		cart: [
			{
				name: {
					type: String
				},
				price: {
					type: Number
				},
				quantity: {
					type: Number,
					default: 1
				}
			}
		],
		isAdmin: {
			type: Boolean,
			default: false,
			required: true
		}
	},
	{
		timestamps: true
	}
);

const userModel = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default userModel;
