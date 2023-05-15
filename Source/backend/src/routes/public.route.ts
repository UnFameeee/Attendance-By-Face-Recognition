import { Routes } from '../interfaces/routes.interface';
import express, { Router } from 'express';
import path from 'path';

export class PublicRoute implements Routes {
  public path = "/public";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router.use(`${this.path}/images`,
      express.static(path.join(__dirname, '/../public/images/')),
    )

    this.router.use(`${this.path}/training/`,
      express.static(path.join(__dirname, '/../public/training/')),
    )

    this.router.use(`${this.path}/attendance/`,
      express.static(path.join(__dirname, '/../public/attendance/')),
    )

    this.router.use(`${this.path}/attendance-exception/`,
      express.static(path.join(__dirname, '/../public/attendance-exception/')),
    )

    this.router.use(`${this.path}/models/`,
      express.static(path.join(__dirname, '/../public/models/')),
    )

    this.router.use(`${this.path}/train-model/`,
      express.static(path.join(__dirname, '/../public/train-model/')),
    )
  }
}