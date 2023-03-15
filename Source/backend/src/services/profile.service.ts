import { ResponseData } from '../config/responseData.config';
import { prisma } from '../database/prisma.singleton';
import { UpdateProfileDTO, UpdateProfilePasswordDTO } from '../model/dtos/profile.dto';
import { ProfileModel } from '../model/view-model/profile.model';
import * as bcrypt from 'bcrypt';

export class ProfileService {
  public getProfileDetail = async (employeeId: string) => {
    const response = new ResponseData<ProfileModel>;

    const queryData = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        deleted: false,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        joiningDate: true,
        location: {
          select: {
            address: true,
            city: true,
            country: true,
            state: true,
          }
        },
        role: {
          select: {
            displayName: true,
          }
        },
        department: {
          select: {
            departmentName: true,
          }
        }
      }
    })

    if (queryData) {
      response.result = queryData;
    } else {
      response.message = `Employee isn't exist`;
      return response;
    }
    return response;
  }

  public updateProfileDetail = async (employeeId: string, data: UpdateProfileDTO) => {
    const response = new ResponseData<ProfileModel>;

    const isValidEmployee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        deleted: false,
      }
    })

    if (!isValidEmployee) {
      response.message = `Employee isn't exist`;
      return response;
    }

    const queryData = await prisma.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        fullname: data.fullname,
        email: data.email,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        location: {
          upsert: {
            update: {
              address: data.location.address,
              city: data.location.city,
              country: data.location.country,
              state: data.location.state
            },
            create: {
              address: data.location.address,
              city: data.location.city,
              country: data.location.country,
              state: data.location.state
            },
          }
        }
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        joiningDate: true,
        location: {
          select: {
            address: true,
            city: true,
            country: true,
            state: true,
          }
        },
        role: {
          select: {
            displayName: true,
          }
        },
        department: {
          select: {
            departmentName: true,
          }
        }
      }
    })

    response.result = queryData;
    return response;
  }

  public updateProfilePassword = async (employeeId: string, data: UpdateProfilePasswordDTO) => {
    const response = new ResponseData<string>;

    const isValidEmployee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        deleted: false,
      }
    })

    if (!isValidEmployee) {
      response.message = `Employee isn't exist`;
      return response;
    }

    const matchValidation = await bcrypt.compare(data.oldPassword, isValidEmployee.password);
    if (!matchValidation) {
      response.message = `Wrong Password, please try again`;
      return response;
    }

    const matchPassword = data.newPassword == data.confirmPassword;
    if (!matchPassword) {
      response.message = `New Password mismatch, please try again`;
      return response;
    }

    const queryData = await prisma.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        password: await bcrypt.hash(data.newPassword, 10),
      }
    })

    response.result = `Change password successfully`;
    return response;
  }
}