import { Routes } from '../interfaces/routes.interface';
import express, { Router } from 'express';

export class PublicRoute implements Routes {
  public path = "/public";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router.get(`${this.path}/images`,
      express.static(`src/public/images`),
    )

    this.router.get(`${this.path}/models/`,
      express.static(`src/public/models`),
    )

    this.router.get(`${this.path}/train-model/`,
      express.static(`src/public/train-model`),
    )
  }
}