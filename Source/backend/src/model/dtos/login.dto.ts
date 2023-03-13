import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .trim()
    .email('Invalid email'),

  password: z
    .string({
      required_error: 'Password is required',
    })
    .trim(),
    // .refine((value) => /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(value), "Password require 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number and minimum length is 8"),
});
export type LoginDTO = z.infer<typeof loginSchema>;