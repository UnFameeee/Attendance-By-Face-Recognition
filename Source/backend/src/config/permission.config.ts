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
  "assign-department-management": [
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
    `${ROLE.ADMIN}-${PERMISSION.READ_TRAIN}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE_TRAIN}`,
    `${ROLE.MANAGER}-${PERMISSION.READ}`,
    `${ROLE.MANAGER}-${PERMISSION.READ_TRAIN}`,
    `${ROLE.MANAGER}-${PERMISSION.UPDATE_TRAIN}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.READ}`,
  ],
  "shifttype-management": [
    `${ROLE.ADMIN}-${PERMISSION.CREATE}`,
    `${ROLE.ADMIN}-${PERMISSION.READ}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE}`,
    `${ROLE.ADMIN}-${PERMISSION.DELETE}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.READ}`,
    `${ROLE.MANAGER}-${PERMISSION.READ}`,
  ],
  "workshift-management": [
    `${ROLE.ADMIN}-${PERMISSION.CREATE}`,
    `${ROLE.ADMIN}-${PERMISSION.READ}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE}`,
    `${ROLE.ADMIN}-${PERMISSION.DELETE}`,
    `${ROLE.MANAGER}-${PERMISSION.CREATE}`,
    `${ROLE.MANAGER}-${PERMISSION.READ}`,
    `${ROLE.MANAGER}-${PERMISSION.UPDATE}`,
    `${ROLE.MANAGER}-${PERMISSION.DELETE}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.READ}`,
  ],
  "leavetype-management": [
    `${ROLE.ADMIN}-${PERMISSION.CREATE}`,
    `${ROLE.ADMIN}-${PERMISSION.READ}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE}`,
    `${ROLE.ADMIN}-${PERMISSION.DELETE}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.READ}`,
    `${ROLE.MANAGER}-${PERMISSION.READ}`,
  ],
  "leave-request-personal": [
    `${ROLE.ADMIN}-${PERMISSION.CREATE}`,
    `${ROLE.ADMIN}-${PERMISSION.READ}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE}`,
    `${ROLE.MANAGER}-${PERMISSION.CREATE}`,
    `${ROLE.MANAGER}-${PERMISSION.READ}`,
    `${ROLE.MANAGER}-${PERMISSION.UPDATE}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.READ}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.CREATE}`,
  ],
  "leave-request-management": [
    `${ROLE.ADMIN}-${PERMISSION.READ}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE}`,
    `${ROLE.ADMIN}-${PERMISSION.DELETE}`,
    `${ROLE.MANAGER}-${PERMISSION.READ}`,
    `${ROLE.MANAGER}-${PERMISSION.UPDATE}`,
    `${ROLE.MANAGER}-${PERMISSION.DELETE}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.READ}`,
  ],
  "attendance-management": [
    `${ROLE.ADMIN}-${PERMISSION.READ}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE}`,
    `${ROLE.ADMIN}-${PERMISSION.DELETE}`,
    `${ROLE.MANAGER}-${PERMISSION.READ}`,
    `${ROLE.MANAGER}-${PERMISSION.UPDATE}`,
    `${ROLE.MANAGER}-${PERMISSION.DELETE}`,
    `${ROLE.EMPLOYEE}-${PERMISSION.READ}`,
  ],
  "attendance-exception-management": [
    `${ROLE.ADMIN}-${PERMISSION.READ}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE}`,
    `${ROLE.ADMIN}-${PERMISSION.DELETE}`,
    `${ROLE.MANAGER}-${PERMISSION.READ}`,
    `${ROLE.MANAGER}-${PERMISSION.UPDATE}`,
    `${ROLE.MANAGER}-${PERMISSION.DELETE}`,
  ],
  "facial-recognition": [
    `${ROLE.ADMIN}-${PERMISSION.CREATE}`,
    `${ROLE.ADMIN}-${PERMISSION.READ}`,
    `${ROLE.ADMIN}-${PERMISSION.UPDATE}`,
    `${ROLE.ADMIN}-${PERMISSION.DELETE}`,
  ]
}