import { z } from 'zod';

export const createEmployeeSchema = z.object({
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

  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: "Password must be string"
    })
    .trim()
    .refine((value) => /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(value), "Password require 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number and minimum length is 8"),

  displayName: z
    .string({
      required_error: 'Display Role Name is required',
      invalid_type_error: "Display Role Name must be string"
    })
    .trim(),

  gender: z
    .string({
      invalid_type_error: "Gender must be string"
    })
    .trim()
    .optional(),

  dateOfBirth: z
    .string({
      invalid_type_error: "Date Of Birth must be string"
    })
    .trim()
    .optional(),

  description: z
    .string()
    .trim()
    .optional(),

  phoneNumber: z
    .string({
      invalid_type_error: "Phone Number must be string"
    })
    .optional(),

  location: z.object({
    address: z
      .string({
        invalid_type_error: "Address must be string"
      })
      .trim()
      .optional(),
    city: z
      .string({
        invalid_type_error: "City must be string"
      })
      .trim()
      .optional(),
    country: z
      .string({
        invalid_type_error: "Country must be string"
      })
      .trim()
      .optional(),
      
    state: z
      .string({
        invalid_type_error: "State must be string"
      })
      .trim()
      .optional(),
  }).optional()
});
export type CreateEmployeeDTO = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = z.object({
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
    .string({
      required_error: 'Phone is required',
      invalid_type_error: "Phone Number must be string"
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
export type UpdateEmployeeDTO = z.infer<typeof updateEmployeeSchema>;

export const assignEmployeeDepartmentSchema = z.object({
  employeeId: z
    .string({
      required_error: 'Employee Id is required',
      invalid_type_error: "Employee Id must be string"
    })
    .trim(),

  departmentId: z
    .string({
      required_error: 'Department Id is required',
      invalid_type_error: "Department Id must be string"
    })
    .trim()
})
export type AssignEmployeeDepartmentDTO = z.infer<typeof assignEmployeeDepartmentSchema>;

export const assignManagerDepartmentSchema = z.object({
  employeeId: z
    .string({
      required_error: 'Employee Id is required',
      invalid_type_error: "Employee Id must be string"
    })
    .trim(),

  departmentId: z
    .string({
      required_error: 'Department Id is required',
      invalid_type_error: "Department Id must be string"
    })
    .trim()
})
export type AssignManagerDepartmentDTO = z.infer<typeof assignManagerDepartmentSchema>;

export const changeEmployeeRoleSchema = z.object({
  employeeId: z
    .string({
      required_error: 'Employee Id is required',
      invalid_type_error: "Employee Id must be string"
    })
    .trim(),

  displayName: z
    .string({
      required_error: 'Display Role Name is required',
      invalid_type_error: "Display Role Name must be string"
    })
    .trim()
})
export type ChangeRoleDTO = z.infer<typeof changeEmployeeRoleSchema>;