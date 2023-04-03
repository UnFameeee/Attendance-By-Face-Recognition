type stringObject = {
  [key: string]: string
}

export const ROLE: stringObject = {
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee"
}

export const PERMISSION: stringObject = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  GRANT_PERMISSION: "grant_permission",
  GRANT_POSITION: "grant_position",
}

export const RESOURCE: stringObject = {
  ACCOUNT_MANAGEMENT: "account-management",
  PROFILE_MANAGEMENT: "profile-management",
  DEPARTMENT_MANAGEMENT: "department-management",
  ORGANIZATION_MANAGEMENT: "organization-management",
  EMPLOYEE_MANAGEMENT: "employee-management",
  WORKSHIFT_MANAGEMENT: "workshift-management",
  SHIFTTYPE_MANAGEMENT: "shifttype-management",
}