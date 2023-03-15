import { HttpException } from '../config/httpException';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ResponseData } from '../config/responseData.config';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  var errorResponse = new ResponseData<String>();
  try {
    const status: number = error.status || 500;
    errorResponse.message = error.message || 'Server Error';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${errorResponse.message}`);

    res.status(status).json(errorResponse);
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
