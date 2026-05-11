import z from "zod";

export const loginUserSchema = z.object({
  email: z
    .string("Email is required.")
    .trim()
    .nonempty("Email cannot be empty."),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export type TLoginUserSchema = z.infer<typeof loginUserSchema>;
