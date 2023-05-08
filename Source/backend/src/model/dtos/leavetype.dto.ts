import { optional, z } from "zod";

export const modifyLeavetypeSchema = z.object({
  leaveTypeId: z
    .string({
      required_error: 'ShiftTypeId is required',
      invalid_type_error: "ShiftTypeId must be string"
    })
    .trim()
    .optional(),

  name: z
    .string({
      required_error: 'LeaveType Name is required',
      invalid_type_error: "LeaveType Name must be string"
    })
    .trim(),

  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: "Description must be string"
    })
    .trim(),

  annualLeave: z
    .boolean({
      required_error: 'Annual Leave is required',
      invalid_type_error: "Annual Leave must be boolean"
    }),
});
export type ModifyLeavetypeDTO = z.infer<typeof modifyLeavetypeSchema>;