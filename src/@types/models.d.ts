import { Types } from 'mongoose';

export type CartItemInterface = {
	// _id?: Types.ObjectId;
	name?: string;
	price?: number;
	quantity?: number;
};

export type UserInterface = {
	_id?: Types.ObjectId;
	email: string;
	password: string;
	phone: string;
	cart?: CartItemInterface[];
	isAdmin?: boolean;
};