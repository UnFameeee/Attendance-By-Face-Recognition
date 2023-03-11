import { Response, NextFunction } from 'express';
import { RequestWithProfile } from '../interfaces/auth.interface';
import { prisma } from '../database/prisma.singleton';
import { PERMISSION, ROLE } from '../constant/database.constant';
import { ResponseData } from '../config/responseData.config';

// type MiddlewareFunction = (req: RequestWithProfile, res: Response, next: NextFunction) => void;

// const middlewareFunctions: MiddlewareFunction[] = [

// ];

// function combineMiddleware(...middlewareFunctions: any) {
//   return (req: RequestWithProfile, res: Response, next: NextFunction) => {
//     middlewareFunctions.reduceRight((prevMiddleware: MiddlewareFunction, currentMiddleware: MiddlewareFunction) => {
//       return (req: RequestWithProfile, res: Response, next: NextFunction) => {
//         currentMiddleware(req, res, () => {
//           prevMiddleware(req, res, next);
//         });
//       };
//     });
//   };
// }

export const authorizeRoute = async (permission: string, resource: string) => async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<any> => {
  const response = new ResponseData<string>();
  const employee = req.profile;
  const queryEmpData = await prisma.employee.findUnique({
    where: {
      id: employee.id,
    }
  })
  const role = await prisma.role.findUnique({
    where: {
      roleId: queryEmpData.roleId,
    }
  })
  const queryData = await prisma.rolePermission.findFirst({
    where: {
      resource: {
        resourceName: resource
      },
      roleId: role.roleId,
      permission: {
        permissionName: { in: [permission, PERMISSION.ALL] },
      }
    }
  })

  if (!queryData) {
    response.message = 'Access Denied';
    return res.status(403).json(response);
  } else {
    next();
  }
}