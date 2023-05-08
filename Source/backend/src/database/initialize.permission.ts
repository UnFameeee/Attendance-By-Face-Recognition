import { application_admin_account } from '../config/initializeData.config';
import { application_permission } from '../config/permission.config';
import { ROLE, PERMISSION, RESOURCE } from '../constant/database.constant';
import { Helper } from '../utils/helper';
import { prisma } from "./prisma.singleton";
import * as bcrypt from 'bcrypt';

export const initializeRolePermission = async () => {
  //initalize ROLE
  for (const role in ROLE) {
    const queryData = await prisma.role.findUnique({
      where: {
        roleName: ROLE[role],
      }
    })
    if (!queryData) {
      await prisma.role.create({
        data: {
          roleName: ROLE[role],
          displayName: Helper.UppercaseFirstLetter(ROLE[role]),
        },
      })
    }
  }

  //initalize PERMISSION
  for (const permission in PERMISSION) {
    const queryData = await prisma.permission.findUnique({
      where: {
        permissionName: PERMISSION[permission],
      }
    })
    if (!queryData) {
      await prisma.permission.create({
        data: {
          permissionName: PERMISSION[permission],
        },
      })
    }
  }

  //initalize RESOURCE
  for (const resource in RESOURCE) {
    const queryData = await prisma.resource.findUnique({
      where: {
        resourceName: RESOURCE[resource],
      }
    })
    if (!queryData) {
      await prisma.resource.create({
        data: {
          resourceName: RESOURCE[resource],
        },
      })
    }
  }

  for (const screen in application_permission) {
    const screenObj = application_permission[screen as keyof typeof application_permission];
    for (const rolePermission of screenObj) {
      const role_and_permission = rolePermission.split("-");
      //get rolePermission with resource
      const queryData = await prisma.rolePermission.findFirst({
        where: {
          resource: {
            resourceName: screen
          },
          role: {
            roleName: role_and_permission[0],
          },
          permission: {
            permissionName: role_and_permission[1],
          }
        }
      })
      if (!queryData) {
        const role = await prisma.role.findUnique({ where: { roleName: role_and_permission[0] } });
        const resource = await prisma.resource.findUnique({ where: { resourceName: screen } });
        const permission = await prisma.permission.findUnique({
          where: { permissionName: role_and_permission[1] },
        });
        await prisma.rolePermission.create({
          data: {
            resourceId: resource.resourceId,
            roleId: role.roleId,
            permissionId: permission.permissionId
          },
        })
      }
    }
  }

  //initalize ADMIN ACCOUNT
  for (const account of application_admin_account) {
    const role = await prisma.role.findUnique({ where: { roleName: account.roleName } });
    const queryData = await prisma.employee.findUnique({
      where: {
        email: account.email
      }
    })
    if (!queryData) {
      const hashedPassword = await bcrypt.hash(account.password, 10);
      const admin = await prisma.employee.create({
        data: {
          fullname: account.fullname,
          email: account.email,
          password: hashedPassword,
          roleId: role.roleId
        }
      })
    }
  }
}