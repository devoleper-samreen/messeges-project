import { z } from "zod"

export const usernameValidation = z
    .string()
    .min(2, "username must be at least 2 characters")
    .max(20, "username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")


export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({
        message : "Invalid Email Address"
    }),
    password : z.string().min(6, {message : "password must be at least 6 character"})
})    

