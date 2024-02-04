import { z } from "zod";

export const signupUserZod = z.object({

	email: z.string({ required_error: "Email is required" }).email(),

	password: z
		.string({
			required_error: "Password is required"
		})
		.min(8, { message: "Password must be 8 or more characters long" }),

	phone: z.string({
		required_error: "User Phone Number is required",
	})
		.min(11, { message: 'User phone number must be at least 11 for nigerians' }),
});

export const loginZod = z.object({
	email: z.string({ required_error: "Email is required" }).email(),

	password: z
		.string({
			required_error: "Password is required"
		})
		.min(8, { message: "Password must be 8 or more characters long" })
});

export const contactZod = z.object({
	email: z.string({ required_error: "Email is required" }).email(),
	phone: z
		.string({
			required_error: "User Phone Number is required"
		})
		.min(11, { message: "User phone number must be at least 11 for nigerians" }),
	subject: z.string({ required_error: "Subject of the mail is required"}),
	name: z.string({ required_error: "Users name is required"}),
	message: z.string({ required_error: "Body of the mail is required"}),
});
