import { z } from "zod";

export const modifyShifttypeSchema = z.object({
  shiftTypeId: z
    .string({
      required_error: 'ShiftTypeId is required',
      invalid_type_error: "ShiftTypeId must be string"
    })
    .trim(),

  shiftName: z
    .string({
      required_error: 'ShiftName is required',
      invalid_type_error: "ShiftName must be string"
    })
    .trim(),

  startTime: z
    .string({
      required_error: 'StartTime is required',
      invalid_type_error: "StartTime must be string"
    })
    .trim(),

  endTime: z
    .string({
      required_error: 'EndTime is required',
      invalid_type_error: "EndTime must be string"
    })
    .trim(),
});
export type ModifyShifttypeDTO = z.infer<typeof modifyShifttypeSchema>;