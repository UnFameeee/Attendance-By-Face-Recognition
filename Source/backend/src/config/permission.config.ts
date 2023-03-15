import { PERMISSION, ROLE } from "../constant/database.constant";

export const application_permission = {
  "account-management": [
    `${ROLE.ADMIN}-${PERMISSION.CREATE}`,
    `${ROLE.ADMIN}-${PERMISSION.READ}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE}`,
    `${ROLE.ADMIN}-${PERMISSION.DELETE}`,
  ],
  "profile-management": [
    `${ROLE.ADMIN}-${PERMISSION.READ}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE}`,
    `${ROLE.ADMIN}-${PERMISSION.DELETE}`,
    `${ROLE.MANAGER}-${PERMISSION.READ}`,
    `${ROLE.MANAGER}-${PERMISSION.UPDATE}`,
    `${ROLE.MANAGER}-${PERMISSION.DELETE}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.READ}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.UPDATE}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.DELETE}`,
  ],
  "department-management": [
    `${ROLE.ADMIN}-${PERMISSION.CREATE}`,
    `${ROLE.ADMIN}-${PERMISSION.READ}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE}`,
    `${ROLE.ADMIN}-${PERMISSION.DELETE}`,
    `${ROLE.ADMIN}-${PERMISSION.GRANT_PERMISSION}`,
    `${ROLE.ADMIN}-${PERMISSION.GRANT_POSITION}`,
    `${ROLE.MANAGER}-${PERMISSION.READ}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.READ}`,
  ],
  "organization-management": [
    `${ROLE.ADMIN}-${PERMISSION.CREATE}`,
    `${ROLE.ADMIN}-${PERMISSION.READ}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE}`,
    `${ROLE.MANAGER}-${PERMISSION.READ}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.READ}`,
  ],
  "employee-management": [
    `${ROLE.ADMIN}-${PERMISSION.CREATE}`,
    `${ROLE.ADMIN}-${PERMISSION.READ}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE}`,
    `${ROLE.ADMIN}-${PERMISSION.DELETE}`,
    `${ROLE.ADMIN}-${PERMISSION.GRANT_PERMISSION}`,
    `${ROLE.ADMIN}-${PERMISSION.GRANT_POSITION}`,
    `${ROLE.MANAGER}-${PERMISSION.READ}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.READ}`,
  ],
}

export const application_admin_account = {
  fullname: "admin",
  email: "admin@unfame.tech",
  password: "admin123!!!",
  roleName: "admin"
}