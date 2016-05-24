import { injectable, inject } from "inversify";
import { HttpService } from "./common/httpService";
import { Express, Request, Response, NextFunction } from "express";
import { Provider, ProviderSchema } from "../models/provider";
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

        this.httpService.addPostRoute('/api/v1.0/admin/providers',
            this.httpService.needsRight(USER_SUPERADMIN),
            (req: Request, res: Response, next: NextFunction) => { this.createProvider(req, res, next); }
        );

    }

    private getProviders(req: Request, res: Response, next: NextFunction): any {
        this.getProvidersInDB()
            .then((providers) => { res.status(200).json({ "data": providers }); })
            .catch((error) => { res.status(400).json({ details: error.message }); });
    }

    private createProvider(req: Request, res: Response, next: NextFunction): any {
        let provider = new Provider(req.body);
        this.saveProviderInDB(provider)
            .then(() => { res.status(200); })
            .catch((error) => { res.status(400).json({ details: error.message }); });
    }

    private saveProviderInDB(provider: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            provider.save((err, pvder) => {
                if (!err) {
                    console.info('[PROVIDER_SERVICE] -- Set provider "' + provider.name + '" in DB success');
                    resolve(pvder);
                }
                else {
                    var errorMessage = 'set provider "' + provider.name + '" in DB failure ' + err;
                    console.log('[PROVIDER_SERVICE] -- ' + errorMessage);
                    reject(new Error(errorMessage));
                }
            });
        });
    }

    private getProvidersInDB = function () {
        return new Promise<Array<any>>((resolve, reject) => {
            Provider.find({}, (err, providers) => {
                if (!err) {
                    console.log('[PROVIDER_SERVICE] -- Get providers from DB success');
                    resolve(providers);
                }
                else {
                    let errorMessage = 'Get providers from DB failure' + err;
                    console.log('[PROVIDER_SERVICE] -- ' + errorMessage);
                    reject(new Error(errorMessage));
                }
            });
        });
    }
}