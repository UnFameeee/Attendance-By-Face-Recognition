import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { URLController } from "../controllers/url.controller";

export class URLRoute implements Routes {
  public path = "/url-generate";
  public router = Router();
  public urlController = new URLController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router.get(`${this.path}/qr`,
      this.urlController.generateURL
    )

    this.router.post(`${this.path}/qr/validate`,
      this.urlController.validateURL
    )
  }
}