import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { HttpException } from '../config/httpException';

export const zodValidate =
  (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.parseAsync(req.body);
        next();
      } catch (error) {
        let err: { [index: string]: any } = error;
        if (err instanceof z.ZodError) {
          err = err.issues.map((e) => ({ path: e.path[0], message: e.message }));
        }

        // return res.status(409).json({
        //   status: 'failed',
        //   error: err,
        // });

        next(new HttpException(400, (err[0]["message"])))
      }
    };