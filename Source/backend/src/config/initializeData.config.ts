import { Helper } from "../utils/helper";

export const shifttype_data = [
  {
    shiftTypeId: "c15ade5b-8f0b-4c10-982b-90e5aa660561",
    shiftName: "Fulltime",
    startTime: Helper.ConfigStaticDateTime("09:00"),
    endTime: Helper.ConfigStaticDateTime("18:00"),
  },
  {
    shiftTypeId: "2bcc44fa-9e78-4308-8a66-e8668217e720",
    shiftName: "Morning",
    startTime: Helper.ConfigStaticDateTime("09:00"),
    endTime: Helper.ConfigStaticDateTime("12:00"),
  },
  {
    shiftTypeId: "2547c8e0-8212-4115-b8d6-a36cc384d84d",
    shiftName: "Afternoon",
    startTime: Helper.ConfigStaticDateTime("13:00"),
    endTime: Helper.ConfigStaticDateTime("18:00"),
  },
]

export const leavetype_data = [
  {
    leaveTypeId: "67037d62-a144-43a4-880d-7b4a28684f7c",
    name: "Annual Leave",
    description: "This type of leave is typically granted to employees for taking time off for personal reasons, such as a planned vacation or personal commitments.",
    annualLeave: true,
  },
  {
    leaveTypeId: "f75fe991-621c-4aa3-9541-acd2db926b3e",
    name: "Personal Leave",
    description: "Personal leave or Unpaid leave is often granted for specific personal reasons that are not covered by other types of leave. It may be used for personal appointments, family events, or other non-work-related purposes",
    annualLeave: false,
  },
  {
    leaveTypeId: "0ea876d6-4b00-4aed-8fca-25b6a2faa227",
    name: "Sick Leave",
    description: "Sick leave is provided to employees when they are ill or injured and unable to perform their duties. It allows employees to take time off to recover and seek medical treatment",
    annualLeave: false,
  },
]

export const application_admin_account = [
  {
    fullname: "admin",
    email: "admin@unfame.tech",
    password: "admin123!!!",
    roleName: "admin"
  },
  {
    fullname: "junrante",
    email: "junrante@gmail.com",
    password: "741123963",
    roleName: "admin"
  },
]