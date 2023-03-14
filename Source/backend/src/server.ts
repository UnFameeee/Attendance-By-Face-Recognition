import App from "./app";
import IndexRoute from './routes/index.route';
import { AuthenticationRoute } from "./routes/auth.route";
import { OrganizationRoute } from "./routes/organization.route";
import { DepartmentRoute } from "./routes/department.route";
import { EmployeeRoute } from './routes/employee.route';

// validateEnv();
const app = new App([
    new IndexRoute(),
    new AuthenticationRoute(),
    new EmployeeRoute(),
    new DepartmentRoute(),
    new OrganizationRoute(),
]);
app.listen();