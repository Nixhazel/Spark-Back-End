import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/userModel";
import Products from "../models/productsModel";

export const addproducts = async (req: Request, res: Response) => {
	try {
		const userId = req.user;
		const adminUser = await User.findOne({ _id: userId }).exec();

		if (!adminUser?.isAdmin) {
			return res.status(401).send({
				message: "User is not an Admin",
				success: false,
				path: req.url
			});
		}
		const {
			name,
			category,
			price,
			quantity,
			description,
			image1,
			image2,
			image3
		} = req.body;

		const existingProducts = await Products.findOne({
			name: name,
			price: price
		});
		if (existingProducts) {
			return res.status(401).send({
				message: "Product already exists",
				success: false,
				path: req.url
			});
		}

		const newProductsData = {
			name,
			category,
			price,
			quantity,
			description,
			images: { image1, image2, image3 }
		};
		const newProducts = new Products(newProductsData);

		await newProducts.save();
		return res.status(201).send({
			success: true,
			path: req.url,
			message: `Product Added successfully`,
			data: newProducts
		});
	} catch (error) {
		return res.status(500).send({
			status: "error",
			error: error,
			path: req.url,
			message: "Error Adding Product",
			success: false
		});
	}
};

export const editproducts = async (req: Request, res: Response) => {
	try {
		const userId = req.user;
		const adminUser = await User.findOne({ _id: userId }).exec();

		if (!adminUser?.isAdmin) {
			return res.status(401).send({
				message: "User is not an Admin",
				success: false,
				path: req.url
			});
		}

		const product = await Products.findOne({
			_id: req.params.productId
		}).exec();
		if (!product) {
			return res.status(401).send({
				message: "Product dose not exist",
				success: false,
				path: req.url
			});
		}

		const {
			name,
			category,
			price,
			quantity,
			description,
			image1,
			image2,
			image3
		} = req.body;

		const newProductsData = {
			name,
			category,
			price,
			quantity,
			description,
			images: { image1, image2, image3 }
		};
		const updateProducts = await Products.findOneAndUpdate(
			{ _id: req.params.driverId },
			newProductsData,
			{ new: true }
		);
		return res.status(201).send({
			success: true,
			path: req.url,
			message: `Product Updated successfully`,
			data: updateProducts
		});
	} catch (error) {
		return res.status(500).send({
			status: "error",
			error: error,
			path: req.url,
			message: "Error Updating Product",
			success: false
		});
	}
};
