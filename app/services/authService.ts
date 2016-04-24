import { injectable, inject } from "inversify";
import { HttpService } from "./common/httpService";
import { Express, Request, Response, NextFunction } from "express";

export interface AuthService {
    getVersion(req: Request, res: Response, next: NextFunction) : any;
}

@injectable()
export class AuthServiceImpl implements AuthService {
    
    private httpService : HttpService; 
        
    constructor(
        @inject("HttpService") httpService : HttpService) {
            
        this.httpService = httpService;
        this.httpService.addGetRoute('/api/version', this.getVersion); 
    }  
 
    public getVersion(req: Request, res: Response, next: NextFunction) : any {
	    res.status(200).send("Yes men") //.end();  
    }  
         
} 