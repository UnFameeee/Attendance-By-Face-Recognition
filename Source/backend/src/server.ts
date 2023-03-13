import App from "./app";
import AuthenticationRoute from "./routes/auth.route";
import { DepartmentRoute } from "./routes/department.route";
import IndexRoute from './routes/index.route';
import { OrganizationRoute } from "./routes/organization.route";

// validateEnv();
const app = new App([
    new IndexRoute(),
    new AuthenticationRoute(),
    new DepartmentRoute(),
    new OrganizationRoute(),
]);
app.listen();