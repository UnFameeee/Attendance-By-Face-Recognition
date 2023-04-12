import { Location, Organization } from "@prisma/client";

export interface OrganizationModel extends
  Pick<Organization,
    "organizationId" |
    "organizationName"
  > {
  location: Pick<Location,
    "address" |
    "city" |
    "country" |
    "state"
  >,
}

export interface OrganizationListModel extends
  Pick<Organization,
    "organizationId" |
    "organizationName"
  > {
}