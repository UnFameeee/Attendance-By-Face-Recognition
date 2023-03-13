import { NextFunction, Response } from 'express';
import { RequestWithProfile } from '../interfaces/auth.interface';
import { HttpException } from "../config/httpException";
import { OrganizationService } from "../services/organization.service";
import { CreateOrganizationDTO, UpdateOrganizationDTO } from '../model/dtos/organization.dto';

export class OrganizationController {
  public organizationService = new OrganizationService();

  public getOrganizationDetail = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.organizationService.getOrganizationDetail();
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public getOrganizationList = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.organizationService.getOrganizationList();
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public createOrganization = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateOrganizationDTO = req.body;
      const response = await this.organizationService.createOrganization(data);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }

  public updateOrganizationDetail = async (req: RequestWithProfile, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.params.organizationId;
      const data: UpdateOrganizationDTO = req.body;
      const response = await this.organizationService.updateOrganizationDetail(organizationId, data);
      res.status(200).json(response);
    } catch (err) {
      next(new HttpException(500, "Server Error"));
    }
  }
}