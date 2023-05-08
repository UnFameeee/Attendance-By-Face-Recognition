import { z } from "zod";

export const createLeaveRequestSchema = z.object({
  leaveTypeId: z
    .string({
      required_error: 'LeaveType is required',
      invalid_type_error: "LeaveType must be string"
    })
    .trim()
    .optional(),

  startDate: z
    .string({
      required_error: 'Start Date is required',
      invalid_type_error: "Start Date must be string"
    })
    .trim(),

  endDate: z
    .string({
      required_error: 'End Date is required',
      invalid_type_error: "End Date must be string"
    })
    .trim(),

  reason: z
    .string({
      required_error: 'Reason is required',
      invalid_type_error: "Reason must be string"
    })
    .trim(),

  note: z
    .string({
      required_error: 'Note is required',
      invalid_type_error: "Note must be string"
    })
    .trim(),
});
export type CreateLeaveRequestDTO = z.infer<typeof createLeaveRequestSchema>;