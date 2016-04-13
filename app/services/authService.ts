import { injectable, inject } from "inversify";
import { HttpService } from "./httpService";
import { Express } from "express";

export interface AuthService {

}

@injectable()
export class AuthServiceImpl implements AuthService {
    
    private httpService : HttpService;    
        
    constructor(@inject("HttpService") httpService : HttpService) {
        this.httpService = httpService;
        this.addVersionHandler();
    }
 
    private addVersionHandler() : void {
        this.httpService.addGetRoute('/api/version', (req, res, next) => {
	        res.status(200).send("Yes men").end();
        });
    }
         
} 