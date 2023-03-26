import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";

export class AttendanceRoute implements Routes {
  public path = "/attendance";
  public router = Router();
  // public attendanceController = new AttendanceController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    // api/employee/listEmployee
    this.router.post(`${this.path}/`)
  }
}