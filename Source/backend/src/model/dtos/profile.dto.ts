import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullname: z
    .string({
      required_error: 'Fullname is required',
      invalid_type_error: "Fullname must be string"
    })
    .trim()
    .min(5, 'Fullname must be 8 characters long'),

  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: "Email must be string"
    })
    .trim()
    .email('Invalid email'),

  gender: z
    .string({
      required_error: 'Gender is required',
      invalid_type_error: "Gender must be string"
    })
    .trim(),

  dateOfBirth: z
    .string({
      required_error: 'Date Of Birth is required',
      invalid_type_error: "Date Of Birth must be string"
    })
    .trim(),

  description: z
    .string()
    .trim()
    .optional(),

  phoneNumber: z
    .number({
      required_error: 'Phone is required',
      invalid_type_error: "Phone Number must be number"
    }),

  location: z.object({
    address: z
      .string({
        required_error: 'Address is required',
        invalid_type_error: "Address must be string"
      })
      .trim(),
    city: z
      .string({
        required_error: 'City is required',
        invalid_type_error: "City must be string"
      })
      .trim(),
    country: z
      .string({
        required_error: 'Country is required',
        invalid_type_error: "Country must be string"
      })
      .trim(),
    state: z
      .string({
        required_error: 'State is required',
        invalid_type_error: "State must be string"
      })
      .trim()
  }),
});
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;

export const updateProfilePasswordSchema = z.object({
  oldPassword: z
  .string({
    required_error: 'Old Password is required',
    invalid_type_error: "Old Password must be string"
  })
  .trim()
  .refine((value) => /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(value), "Old Password require 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number and minimum length is 8"),

  newPassword: z
    .string({
      required_error: 'New Password is required',
      invalid_type_error: "New Password must be string"
    })
    .trim()
    .refine((value) => /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(value), "New Password require 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number and minimum length is 8"),

  confirmPassword: z
    .string({
      required_error: 'Confirm Password is required',
      invalid_type_error: "Confirm Password must be string"
    })
    .trim()
    .refine((value) => /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(value), "Confirm Password require 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number and minimum length is 8")
})

export type UpdateProfilePasswordDTO = z.infer<typeof updateProfilePasswordSchema>;