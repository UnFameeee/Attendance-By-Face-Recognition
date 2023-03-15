import { z } from 'zod';

export const pageSchema = z.object({
  page: z
    .number({
      required_error: "Page is required",
      invalid_type_error: "Page must be number"
    })
    .min(0),

  pageSize: z
    .number({
      required_error: "Page Size is required",
      invalid_type_error: "Page Size must be number"
    })
    .min(1),

  totalElement: z
    .number()
    .min(0)
    .optional(),

});
export type PageDTO = z.infer<typeof pageSchema>;