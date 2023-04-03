import { ResponseData } from '../config/responseData.config';
import { prisma } from '../database/prisma.singleton';

export class AttendanceService {
  public takeAttendance = async (employeeId: string) => {
    const response = new ResponseData<boolean>();

    const queryData = await prisma.attendance.findFirst({
      where: {
        employeeId: employeeId,
        
      }
    })
  }
}