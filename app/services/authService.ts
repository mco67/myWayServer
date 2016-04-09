import { injectable, inject } from "inversify";
import { HttpService } from "./httpService";
import { Express } from "express";

export interface AuthService {
    
}

export class AuthServiceImpl implements AuthService {
    
    private express : Express;
    
    constructor(@inject("HttpService") httpService : HttpService) {
        this.express = httpService.express;
        
        this.addVersionHandler();
    }
 
    private addVersionHandler() {
        this.express.post('/api/version', (req, res, next) => {
	        console.log("version");
	        res.status(200).end();
        });
    }
         
} 