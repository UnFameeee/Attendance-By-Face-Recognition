import { Location, Organization } from "@prisma/client";

export interface OrganizationWithLocation extends
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

export interface OrganizationList extends
  Pick<Organization,
    "organizationId" |
    "organizationName"
  > {
    
}