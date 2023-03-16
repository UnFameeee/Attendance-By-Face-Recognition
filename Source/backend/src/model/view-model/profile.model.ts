import { Employee, Location, Department, Role } from '@prisma/client';

export interface ProfileModel extends
  Pick<Employee,
    "id" |
    "fullname" |
    "email" |
    "gender" |
    "dateOfBirth" |
    "phoneNumber" |
    "joiningDate"
  > {
  location: Pick<Location,
    "address" |
    "city" |
    "country" |
    "state"
  >,
  role: Pick<Role,
    "displayName"
  >,
  department: Pick<Department,
    "departmentName"
  >,
}