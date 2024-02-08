import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/userModel";
import { UserInterface } from "../@types/models";
import { contactZod, loginZod, signupUserZod } from "../models/zod";
import sendMail from "../utils/email.config";

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
			});

		return res.status(201).send({
			success: true,
			path: req.url,
			message: `New user created successfully`,
			user: newuser,
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
				message: "This User dose not exist"
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

export const contactUsController = async (req: Request, res: Response) => {
	const error: any = contactZod.safeParse(req.body);
	if (error.success === false) {
		return res.status(400).send({
			success: false,
			path: req.url,
			message: error.error.issues[0].message
		});
	}
	try {
		const { name, email, phone, subject, message } = req.body;
		const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form Submission</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f4f4f4;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #333333;
    }

    p {
      margin-bottom: 10px;
      color: #555555;
    }

    table {
      width: 100%;
      margin-top: 20px;
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 12px;
    }

    th {
      background-color: #f2f2f2;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Contact Form Submission</h2>
    <p>You have received a new contact form submission. Details are below:</p>

    <table>
      <tr>
        <th>Name</th>
        <td>${name}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>${email}</td>
      </tr>
      <tr>
        <th>Phone</th>
        <td>${phone}</td>
      </tr>
      <tr>
        <th>Subject</th>
        <td>${subject}</td>
      </tr>
      <tr>
        <th>Message</th>
        <td>${message}</td>
      </tr>
    </table>
  </div>
</body>
</html>
`;
		await sendMail(email, "Customer Support", html);

		return res.status(201).send({
			status: "success",
			success: true,
			path: req.url,
			message: `Mail Sent successfully`,
			data: {name, email, message, subject}
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			error: error,
			path: req.url,
			message: "Something went wrong sending contact mail",
			success: false
		});
	}
};
