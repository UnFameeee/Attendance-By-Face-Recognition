import App from "./app";
import { AuthenticationRoute } from "./routes/auth.route";
import { OrganizationRoute } from "./routes/organization.route";
import { DepartmentRoute } from "./routes/department.route";
import { EmployeeRoute } from './routes/employee.route';
import { ProfileRoute } from './routes/profile.route';
import { PublicRoute } from './routes/public.route';
import { FacialRecognitionRoute } from './routes/facial-recognition.route';
import { WorkshiftRoute } from "./routes/workshift.route";
import { ShifttypeRoute } from "./routes/shifttype.route";
import { AttendanceRoute } from "./routes/attendance.route";
import { URLRoute } from "./routes/url.route";
import { AttendanceExceptionRoute } from "./routes/attendance-exception.route";
import { LeaveRequestRoute } from "./routes/leave-request.route";
import { LeavetypeRoute } from "./routes/leavetype.route";

// validateEnv();
const app = new App([
    new AuthenticationRoute(),
    new ProfileRoute(),
    new EmployeeRoute(),
    new DepartmentRoute(),
    new OrganizationRoute(),
    new PublicRoute(),
    new FacialRecognitionRoute(),
    new WorkshiftRoute(),
    new ShifttypeRoute(),
    new AttendanceRoute(),
    new URLRoute(),
    new AttendanceExceptionRoute(),
    new LeaveRequestRoute(),
    new LeavetypeRoute(),
]);
app.listen();