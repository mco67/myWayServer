import { injectable, inject } from "inversify";
import { HttpService } from "./common/httpService";
import { Express, Request, Response, NextFunction } from "express";

export interface AuthService {
    authenticatePreFlight(req: Request, res: Response, next: NextFunction) : any;
    authenticate(req: Request, res: Response, next: NextFunction) : any;
}

@injectable()
export class AuthServiceImpl implements AuthService {
    
    private httpService : HttpService; 
        
    constructor(
        @inject("HttpService") httpService : HttpService) {
            
        this.httpService = httpService;
        this.httpService.addOptionsRoute('/api/v1.0/authenticate', this.authenticatePreFlight);
        this.httpService.addGetRoute('/api/v1.0/authenticate', (req: Request, res: Response, next: NextFunction) => { this.authenticate(req, res, next); });  
    }  
 
    public authenticatePreFlight(req: Request, res: Response, next: NextFunction) : any {
	    console.log("[AUTH_SERVICE] /api/v1.0/authenticate : doing preflight");
	    res.status(204).end();
    }
      
    public authenticate(req: Request, res: Response, next: NextFunction) : any {
        console.log("[AUTH_SERVICE] /api/v1.0/authenticate");
        this.httpService.passport.authenticate('basic', (err, user) => {            
            if (err) return res.status(401).json({ message: err });
            let token = this.httpService.encodeToken(user.login);
            res.status(200).json({ token : token, user: user });
        })(req, res, next);
    }  
} 