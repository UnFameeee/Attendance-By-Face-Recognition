import { z } from 'zod';

export const createOrganizationSchema = z.object({
  organizationName: z
    .string({
      required_error: 'Organization Name is required',
      invalid_type_error: "Organization Name must be string"
    })
    .trim()
    .min(1, 'Organization Name cannot be empty'),
  officialWorkingHours: z
    .string({
      required_error: 'Working Hours is required',
      invalid_type_error: "Working Hours must be string"
    })
    .trim()
    .min(1, 'Working Hours cannot be empty'),
  officialBreakingHours: z
    .string({
      required_error: 'Breaking Hours is required',
      invalid_type_error: "Breaking Hours must be string"
    })
    .trim()
    .min(1, 'Breaking Hours cannot be empty'),
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
export type CreateOrganizationDTO = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = z.object({
  organizationName: z
    .string({
      required_error: 'Organization Name is required',
      invalid_type_error: "Organization Name must be string"
    })
    .trim()
    .min(1, 'Organization Name cannot be empty'),
  officialWorkingHours: z
    .string({
      required_error: 'Working Hours is required',
      invalid_type_error: "Working Hours must be string"
    })
    .trim()
    .min(1, 'Working Hours cannot be empty'),
  officialBreakingHours: z
    .string({
      required_error: 'Breaking Hours is required',
      invalid_type_error: "Breaking Hours must be string"
    })
    .trim()
    .min(1, 'Breaking Hours cannot be empty'),
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
export type UpdateOrganizationDTO = z.infer<typeof updateOrganizationSchema>;