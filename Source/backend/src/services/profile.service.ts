import { env } from '../config/env.config';
import { ResponseData } from '../config/responseData.config';
import { prisma } from '../database/prisma.singleton';
import { UpdateProfileDTO, UpdateProfilePasswordDTO } from '../model/dtos/profile.dto';
import { ProfileModel } from '../model/view-model/profile.model';
import * as bcrypt from 'bcrypt';
import { Helper } from '../utils/helper';

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
            roleId: true,
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

    console.log(data)

    const queryData = await prisma.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        fullname: data.fullname,
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

  public uploadImages = async (employeeId: string, files: { [fieldname: string]: Express.Multer.File[] }, index: number) => {
    const response = new ResponseData<any>;

    let isUpdateValidate: any;
    if (index != null) {
      isUpdateValidate = await prisma.employeeImage.findMany({
        where: {
          employeeId: employeeId,
          index: index
        }
      })
    } else {
      isUpdateValidate = await prisma.employeeImage.findMany({
        where: {
          employeeId: employeeId,
        }
      })
    }

    //If we have found exist image in the database
    if (isUpdateValidate.length != 0) {
      //Update a specific image
      if (index != null) {
        let link = `${env.SERVER_URL}/public${(files.images[0].destination).split("public")[1]}/${files.images[0].filename}`

        const queryData = await prisma.employeeImage.update({
          where: {
            imageId: isUpdateValidate[0].imageId
          },
          data: {
            link: Helper.ConvertDoubleSlashURL(link),
          },
        })
        // response.result = `Update image successfully`;
      }
      //Update all images
      else {
        for (const singleQueryData of isUpdateValidate) {
          let link = `${env.SERVER_URL}/public${(files.images[singleQueryData.index - 1].destination).split("public")[1]}/${files.images[singleQueryData.index - 1].filename}`;

          const queryData = await prisma.employeeImage.update({
            where: {
              imageId: singleQueryData.imageId,
            },
            data: {
              link: Helper.ConvertDoubleSlashURL(link),
            },
          })
        }
        // response.result = `Update images successfully`;
      }
    }
    //If there isn't any image in the database 
    else {
      let link_1 = `${env.SERVER_URL}/public${(files.images[0].destination).split("public")[1]}/${files.images[0].filename}`;
      let link_2 = `${env.SERVER_URL}/public${(files.images[1].destination).split("public")[1]}/${files.images[1].filename}`;

      const queryData = await prisma.employeeImage.createMany({
        data: [
          {
            employeeId: employeeId,
            link: Helper.ConvertDoubleSlashURL(link_1),
            index: 1,
            isPrimary: true
          },
          {
            employeeId: employeeId,
            link: Helper.ConvertDoubleSlashURL(link_2),
            index: 2,
            isPrimary: false
          },
        ]
      })
    }
    response.result = (await this.getProfileImages(employeeId)).result;
    return response;
  }

  public getProfileImages = async (employeeId: string) => {
    const response = new ResponseData<any>;
    const queryData = await prisma.employeeImage.findMany({
      where: {
        employeeId: employeeId,
      },
      select: {
        link: true,
        employeeId: true,
        index: true,
        isPrimary: true,
      },

    })
    response.result = queryData;
    return response;
  }
}