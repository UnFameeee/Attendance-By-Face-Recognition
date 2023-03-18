import App from "./app";
import IndexRoute from './routes/index.route';
import { AuthenticationRoute } from "./routes/auth.route";
import { OrganizationRoute } from "./routes/organization.route";
import { DepartmentRoute } from "./routes/department.route";
import { EmployeeRoute } from './routes/employee.route';
import { ProfileRoute } from './routes/profile.route';
import { PublicRoute } from './routes/public.route';

// validateEnv();
const app = new App([
    new IndexRoute(),
    new AuthenticationRoute(),
    new ProfileRoute(),
    new EmployeeRoute(),
    new DepartmentRoute(),
    new OrganizationRoute(),
    new PublicRoute(),
]);
app.listen();