import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/userModel";
import { UserInterface } from '../@types/models';
import { loginZod, signupUserZod } from '../models/zod';

const saltRounds = parseInt(process.env.SALT_ROUNDS || "");
const secret = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response) => {
   const error: any = signupUserZod.safeParse(req.body);
		if (error.success === false) {
			return res.status(400).send({
				success: false,
				path: req.url,
				message: error.error.issues[0].message
			});
		}
	try {
		const { email, password, phone } = req.body;
		const existingUser = await User.findOne({
			email: email
		});
		if (existingUser) {
			return res
				.status(409)
				.send({ message: "Username already in use", success: false });
		}

		const token = jwt.sign({ email: email }, secret, { expiresIn: "1d" });
		const salt = await bcrypt.genSaltSync(saltRounds);
		const hashedPassword = await bcrypt.hashSync(password, salt);

		const newUserData: UserInterface = {
			email,
			phone,
			password: hashedPassword
		};

		const newuser = new User(newUserData);
		await newuser
			.save()
			.then((savedUser) => {
				console.log("User saved:", savedUser);
			})
			.catch((error) => {
				console.error("Error saving user:", error);
			});;

		return res.status(201).send({
			success: true,
			path: req.url,
			message: `New user created successfully`,
			data: newuser,
			token
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			error: error,
			path: req.url,
			message: "Something went wrong creating user",
			success: false
		});
	}
};

export const loginController = async (req: Request, res: Response) => {
   const error: any = loginZod.safeParse(req.body);
		if (error.success === false) {
			return res.status(400).send({
				success: false,
				path: req.url,
				message: error.error.issues[0].message
			});
		}
	try {
		const { email, password } = req.body;
		const user: UserInterface | null = await User.findOne({ email: email });

		if (!user) {
			return res.status(401).send({
				success: false,
				path: req.url,
				message: "User dose not exist"
			});
		}
		const isMatch = await bcrypt.compareSync(password, user.password);
		if (!isMatch) {
			return res.status(401).send({
				success: false,
				path: req.url,
				message: "Invalid Password"
			});
		}

		const token = jwt.sign({ _id: user._id }, secret);
		return res.status(200).send({
			success: true,
			message: "login successful",
			user,
			token
		});
	} catch (error) {
		res.status(500).send({
			error: error,
			path: req.url,
			message: "Something went wrong Loging in",
			success: false
		});
	}
};
