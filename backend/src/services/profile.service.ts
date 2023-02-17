import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class ProfileService {

  public testfunction = async () => {
    await prisma.profile
  }

}

export default ProfileService;