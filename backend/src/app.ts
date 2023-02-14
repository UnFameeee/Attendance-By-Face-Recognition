import express from 'express';

import cors from "cors";
import helmet from 'helmet';
import morgan from 'morgan';
import { logger, stream } from './utils/logger';
import errorMiddleware from './middlewares/error.middleware';
import { Routes } from './interfaces/routes.interface';
require("dotenv").config();

import bodyParser from "body-parser";

class App {
    public app: express.Application;
    public port: string | number;

    constructor(routes: Routes[]) {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    };

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`=================================`);
            logger.info(`🚀 App listening on the port ${this.port}`);
            logger.info(`=================================`);
        });
    }

    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        // this.app.use(morgan());
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach(route => {
            this.app.use('/', route.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}

export default App;