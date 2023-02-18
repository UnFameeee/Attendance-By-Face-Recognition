import { RequestHandler } from "express";
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from "class-transformer";
import { HttpException } from '../exceptions/HttpException';

function validationMiddleware<T>(type: any, skipMissingProperties = false): RequestHandler {
  return (req, res, next) => {
    validate(plainToInstance(type, req.body))
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map(
            (error: ValidationError) => {
              Object.values(error.constraints)
            }
          ).join(', ');
          next(new HttpException(400, message));
        } else {
          next();
        }
      })
  }
}

export default validationMiddleware;