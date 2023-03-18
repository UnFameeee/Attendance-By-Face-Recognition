import { Employee, Location, Department } from '@prisma/client';

export interface EmployeeModel extends
  Pick<Employee,
    "id" |
    "fullname" |
    "email" |
    "gender" |
    "dateOfBirth" |
    "phoneNumber" |
    "joiningDate" |
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
    "joiningDate" |
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