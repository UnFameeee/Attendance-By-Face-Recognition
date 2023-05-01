import { z } from 'zod';

export const submitAttendanceExceptionSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be string',
    })
    .trim()
    .min(1, 'Name cannot be empty'),

  departmentId: z
    .string({
      required_error: 'Department is required',
      invalid_type_error: 'Department must be string',
    })
    .trim()
    .min(1, 'Department cannot be empty'),

  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be string',
    })
    .trim()
    .min(1, 'Email cannot be empty'),

  attendanceType: z
    .string({
      required_error: 'Attendance Type is required',
      invalid_type_error: 'Attendance Type must be string',
    })
    .trim()
    .min(1, 'Attendance Type cannot be empty'),

  image: z
    .string({
      required_error: 'Image is required',
      invalid_type_error: 'Image must be string',
    })
    .trim()
    .min(1, 'Image cannot be empty'),
});
export type SubmitAttendanceExceptionDTO = z.infer<typeof submitAttendanceExceptionSchema>;

export const getAttendanceExceptionDataSchema = z.object({
  attendanceType: z
    .string({
      required_error: 'Attendance Type is required',
      invalid_type_error: 'Attendance Type must be string',
    })
    .trim()
    .min(1, 'Attendance Type cannot be empty'),

  departmentId: z
    .string({
      required_error: 'Department is required',
      invalid_type_error: 'Department must be string',
    })
    .trim()
    .min(1, 'Department cannot be empty'),

  roleName: z
    .string({
      required_error: 'Role is required',
      invalid_type_error: 'Role must be string',
    })
    .trim()
    .min(1, 'Role cannot be empty'),

  filter: z
    .string({
      invalid_type_error: 'Attendance Type must be string',
    })
    .trim()
    .optional()
});
export type GetAttendanceExceptionDataDTO = z.infer<typeof getAttendanceExceptionDataSchema>;