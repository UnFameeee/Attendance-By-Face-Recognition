import { Response, NextFunction } from 'express';
import { RequestWithProfile } from '../interfaces/request.interface';
import { prisma } from '../database/prisma.singleton';
import { ResponseData } from '../config/responseData.config';
import { HttpException } from '../config/httpException';

export const authorizeRoute = async (permission: string, resource: string) => async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<any> => {
  try {
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
          permissionName: permission,
        }
      }
    })

    if (!queryData) {
      response.message = 'Access Denied';
      return res.status(403).json(response);
    } else {
      next();
    }
  } catch (err: any) {
    next(new HttpException(500, (err.message)));
  }
}