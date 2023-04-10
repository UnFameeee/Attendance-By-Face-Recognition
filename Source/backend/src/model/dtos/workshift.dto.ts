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

  shiftTypeId: z
    .string({
      required_error: 'ShiftTypeId is required',
      invalid_type_error: "ShiftTypeId must be string"
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
    .trim()
    .optional(),

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

export const dateTimeSchema = z.object({
  date: z
    .number({
      required_error: 'Date is required',
      invalid_type_error: "Date must be number"
    })
    .min(1, "Date must be more than or equal to 1")
    .max(31, "Date must be less than or equal to 31")
    .optional(),

  month: z
    .number({
      required_error: 'Month is required',
      invalid_type_error: "Month must be number"
    })
    .min(1, "Month must be more than or equal to 1")
    .max(12, "Month must be less than or equal to 12"),

  year: z
    .number({
      required_error: 'Year is required',
      invalid_type_error: "Year must be number"
    })
    .min(1, "Year must be positive number")
});
export type DateTimeDTO = z.infer<typeof dateTimeSchema>;