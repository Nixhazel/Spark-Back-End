import { Types } from "mongoose";

export type CartItemInterface = {
	// _id?: Types.ObjectId;
	name?: string;
	price?: number;
	quantity?: number;
};

export type ImageInterface = {
	image1: string;
	image2: string;
	image3: string
}

export type UserInterface = {
	_id?: Types.ObjectId;
	email: string;
	password: string;
	phone: string;
	cart?: CartItemInterface[];
	isAdmin?: boolean;
};

export type ProductInterface = {
	name: string;
	category: string;
	price: number;
	quantity: number;
	description: string;
	images: ImageInterface;
};
