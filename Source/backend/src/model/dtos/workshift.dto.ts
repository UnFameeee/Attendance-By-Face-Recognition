import { z } from "zod";

// {
// fromDate: ""
// toDate: ""
// month: "",
// year: "",
// shiftName: ""
// employeeIds: [
// "asdas", "asdasd"
// ]
// }

export const autoCreateWorkshiftSchema = z.object({
  fromDate: z
    .number({
      required_error: 'FromDate is required',
      invalid_type_error: "FromDate must be number"
    }),

  toDate: z
    .number({
      required_error: 'ToDate is required',
      invalid_type_error: "ToDate must be number"
    }),

  month: z
    .number({
      required_error: 'Month is required',
      invalid_type_error: "Month must be number"
    }),

  year: z
    .number({
      required_error: 'Year is required',
      invalid_type_error: "Year must be number"
    }),

  shiftName: z
    .string({
      required_error: 'ShiftName is required',
      invalid_type_error: "ShiftName must be string"
    })
    .trim(),

  employeeIds: z.array(z
    .string({
      required_error: 'Employee Id is required',
      invalid_type_error: "EmployeeId must be string"
    })
    .trim(),
  )

});
export type AutoCreateWorkshiftDTO = z.infer<typeof autoCreateWorkshiftSchema>;

export const modifyWorkshiftSchema = z.object({
  shiftId: z
    .string({
      required_error: 'ShiftId is required',
      invalid_type_error: "ShiftId must be string"
    })
    .trim(),

  employeeId: z
    .string({
      required_error: 'EmployeeId is required',
      invalid_type_error: "EmployeeId must be string"
    })
    .trim(),

  shiftTypeId: z
    .string({
      required_error: 'ShiftTypeId is required',
      invalid_type_error: "ShiftTypeId must be string"
    })
    .trim(),

  shiftDate: z
    .string({
      required_error: 'ShiftDate is required',
      invalid_type_error: "ShiftDate must be string"
    })
    .trim(),
});
export type ModifyWorkshiftDTO = z.infer<typeof modifyWorkshiftSchema>;