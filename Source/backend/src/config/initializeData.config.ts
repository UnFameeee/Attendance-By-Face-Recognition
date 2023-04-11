import { Helper } from "../utils/helper";

export const shifttype_data = [
  {
    shiftName: "Fulltime",
    startTime: Helper.ConfigStaticDateTime("09:00"),
    endTime: Helper.ConfigStaticDateTime("18:00"),
  },
  {
    shiftName: "Morning",
    startTime: Helper.ConfigStaticDateTime("09:00"),
    endTime: Helper.ConfigStaticDateTime("12:00"),
  },
  {
    shiftName: "Afternoon",
    startTime: Helper.ConfigStaticDateTime("13:00"),
    endTime: Helper.ConfigStaticDateTime("18:00"),
  },
]