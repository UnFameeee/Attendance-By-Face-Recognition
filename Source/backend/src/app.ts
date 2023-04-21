import express from 'express';
import cors from "cors";
import helmet from 'helmet';
import { logger } from './utils/logger';
import errorMiddleware from './middlewares/error.middleware';
import { Routes } from './interfaces/routes.interface';
import { initializeRolePermission } from './database/initialize.permission';
import { env } from './config/env.config';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { initializeShiftTypeData } from './database/initialize.data';

export default class App {
  public app: express.Application;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = env.PORT || 3000;
    this.initializeData();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  };

  public listen() {
    if (fs.existsSync(path.join(__dirname + "/cert/fullchain.pem")) &&
      fs.existsSync(path.join(__dirname + "/cert/privkey.pem"))) {
      // Create the HTTPS server options
      const httpsOptions = {
        key: fs.readFileSync(path.join(__dirname + "/cert/privkey.pem"), "ascii"),
        cert: fs.readFileSync(path.join(__dirname + "/cert/fullchain.pem"), "ascii"),
      };

      // Create the HTTPS server
      const httpsServer = https.createServer(httpsOptions, this.app);

      // Start the HTTPS server
      httpsServer.listen(this.port, () => {
        logger.info(`=======================================`);
        logger.info(`🚀 App listening HTTPS on the port ${this.port}`);
        logger.info(`=======================================`);
      });
    } else {
      // Start the HTTP server
      this.app.listen(this.port, () => {
        logger.info(`======================================`);
        logger.info(`🚀 App listening HTTP on the port ${this.port}`);
        logger.info(`======================================`);
      });
    }
  }

  public getServer() {
    return this.app;
  }

  private initializeData() {
    initializeRolePermission();
    initializeShiftTypeData(true);
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(helmet({
      crossOriginResourcePolicy: false,
    }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}