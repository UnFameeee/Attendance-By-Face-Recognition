import App from "./app";
import AuthenticationRoute from "./routes/auth.route";
import IndexRoute from './routes/index.route';

// validateEnv();
const app = new App([
    new IndexRoute(),
    new AuthenticationRoute(),
]);
app.listen();