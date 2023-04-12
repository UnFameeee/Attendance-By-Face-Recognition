import { Employee, Location, Department, Role } from '@prisma/client';

export interface EmployeeModel extends
  Pick<Employee,
    "id" |
    "fullname" |
    "email" |
    "gender" |
    "dateOfBirth" |
    "phoneNumber" |
    "description"
  > {
  location: Pick<Location,
    "address" |
    "city" |
    "country" |
    "state"
  >,
  department: Pick<Department,
    "departmentName"
  >,
}

export interface EmployeeWithPasswordModel extends
  Pick<Employee,
    "id" |
    "fullname" |
    "password" |
    "email" |
    "gender" |
    "dateOfBirth" |
    "phoneNumber" |
    "description"
  > {
  location: Pick<Location,
    "address" |
    "city" |
    "country" |
    "state"
  >,
  department: Pick<Department,
    "departmentName"
  >,
}

export interface EmployeeRole extends
  Pick<Role,
    "roleId" | 
    "roleName" | 
    "displayName"
    > {
}
