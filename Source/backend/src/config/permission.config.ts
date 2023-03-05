import { PERMISSION, ROLE } from "../constant/database.constant";

export const application_permission = {
  "account-management": [
    `${ROLE.ADMIN}-${PERMISSION.ALL}`,
    `${ROLE.MANAGER}-${PERMISSION.ALL}`,
  ],
  "profile-management": [
    `${ROLE.ADMIN}-${PERMISSION.ALL}`,
    `${ROLE.MANAGER}-${PERMISSION.ALL}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.ALL}`,
  ],
}

export const application_admin_account = {
  fullname: "admin",
  email: "admin@unfame.tech",
  password: "admin123!!!",
  roleName: "admin"
}