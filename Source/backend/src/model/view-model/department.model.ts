import { Department, Location, Organization } from "@prisma/client";

export interface DepartmentModel extends
  Pick<Department,
    "departmentId" |
    "departmentName"
  > {
  location: Pick<Location,
    "address" |
    "city" |
    "country" |
    "state"
  >,
  organization: Pick<Organization,
    "organizationId" |
    "organizationName"
  >
}