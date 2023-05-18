import { z } from 'zod';

export const createOrganizationSchema = z.object({
  organizationName: z
    .string({
      required_error: 'Organization Name is required',
      invalid_type_error: "Organization Name must be string"
    })
    .trim()
    .min(1, 'Organization Name cannot be empty'),

  limitEarlyLeave: z
    .string({
      required_error: 'Limit Early Leave is required',
    })
    .trim()
    .optional(),

  limitLateArrival: z
    .string({
      required_error: 'Limit Late Arrival is required',
    })
    .trim()
    .optional(),

  yearlyAnnualLeave: z
    .number({
      required_error: 'Yearly Annual Leave is required',
    })
    .optional(),

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

  limitEarlyLeave: z
    .string({
      required_error: 'Limit Early Leave is required',
    })
    .trim()
    .optional(),

  limitLateArrival: z
    .string({
      required_error: 'Limit Late Arrival is required',
    })
    .trim()
    .optional(),

  yearlyAnnualLeave: z
    .number({
      required_error: 'Yearly Annual Leave is required',
    })
    .optional(),

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