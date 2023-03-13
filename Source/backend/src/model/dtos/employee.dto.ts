import { z } from 'zod';

export const createEmployeeSchema = z.object({
  fullname: z
    .string({
      required_error: 'Deparment Name is required',
    })
    .trim()
    .min(5, 'Fullname must be 8 characters long'),

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
    .trim()
    .refine((value) => /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(value), "Password require 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number and minimum length is 8"),

  displayName: z
    .string({
      required_error: 'Display Role Name is required',
    })
    .trim(),
});
export type CreateEmployeeDTO = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = z.object({
  fullname: z
    .string({
      required_error: 'Deparment Name is required',
    })
    .trim()
    .min(5, 'Fullname must be 8 characters long'),

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
    .trim()
    .refine((value) => /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8}$/.test(value), "Password require 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number and minimum length is 8"),

  gender: z
    .string(),

  dateOfBirth: z
    .date(),

  description: z
    .string()
    .trim(),

  phoneNumber: z
    .number(),

  location: z.object({
    address: z
      .string({
        required_error: 'Address is required',
      })
      .trim(),

    city: z
      .string({
        required_error: 'City is required',
      })
      .trim(),

    country: z
      .string({
        required_error: 'Country is required',
      })
      .trim(),

    state: z
      .string({
        required_error: 'State is required',
      })
      .trim()
  }),
});
export type UpdateEmployeeDTO = z.infer<typeof updateEmployeeSchema>;