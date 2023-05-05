import { z } from 'zod';

export const takeAttendanceSchema = z.object({
  employeeId: z
    .string({
      required_error: 'EmployeeId is required',
      invalid_type_error: 'EmployeeId must be string',
    })
    .trim()
    .min(1, 'EmployeeId cannot be empty'),
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
export type TakeAttendanceDTO = z.infer<typeof takeAttendanceSchema>;