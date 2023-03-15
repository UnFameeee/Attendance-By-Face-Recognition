import { Employee, Location, Department } from '@prisma/client';

export interface EmployeeModel extends
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
  department: Pick<Department,
    "departmentName"
  >,
}