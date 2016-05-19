import { injectable, inject } from "inversify";
import { HttpService } from "./common/httpService";
import { Express, Request, Response, NextFunction } from "express";
import { USER_SUPERADMIN } from "../models/user";

export interface ProviderService {

}

@injectable()
export class ProviderServiceImpl implements ProviderService {

    constructor( @inject("HttpService") private httpService: HttpService) {
        console.log("[PROVIDER_SERVICE] -- Attach provider routes");

        this.httpService.addGetRoute('/api/v1.0/admin/providers',
            this.httpService.needsRight(USER_SUPERADMIN),
            (req: Request, res: Response, next: NextFunction) => { this.getProviders(req, res, next); }
        );
    }
    
    private getProviders(req: Request, res: Response, next: NextFunction): any {
        res.status(200).json({ "data": ["Ville de Strasbourg", "Commune d'Eschau"] });
    }
    
    
}