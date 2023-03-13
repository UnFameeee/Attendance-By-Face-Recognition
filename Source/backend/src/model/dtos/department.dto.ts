import { z } from 'zod';

export const createDepartmentSchema = z.object({
  departmentName: z
    .string({
      required_error: 'Deparment Name is required',
    })
    .trim()
    .min(1, 'Deparment Name cannot be empty'),
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
  organization: z.object({
    organizationId: z.string({
      required_error: 'Organization Id is required',
    })
      .trim(),
  })
});
export type CreateDepartmentDTO = z.infer<typeof createDepartmentSchema>;

export const updateDepartmentSchema = z.object({
  departmentName: z
    .string({
      required_error: 'Deparment Name is required',
    })
    .trim()
    .min(1, 'Deparment Name cannot be empty'),
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
  organization: z.object({
    organizationId: z
      .string({
        required_error: 'Organization Id is required',
      })
      .trim(),
  })
});
export type UpdateDepartmentDTO = z.infer<typeof updateDepartmentSchema>;