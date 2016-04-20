/// <reference path="../testRefPath.ts"/>

import "reflect-metadata";
import { Kernel } from "inversify";
import { Express, Request, Response, NextFunction } from "express";
import { AuthService, AuthServiceImpl } from "../../app/services/authService";
import { HttpService } from "../../app/services/httpService";
import { injectable, inject } from "inversify";
import { expect } from 'chai';

@injectable()
class HttpServiceMock implements HttpService {
    public startRestServer() : Promise<any> {
        return null;
    }
    
    public addGetRoute() {
        console.log("cocuo s"); 
    }
}

describe('AuthenticationService', function() {
  describe('authService', function () {
    it('should return version info', function () {
        
        let kernel = new Kernel();
        kernel.bind<AuthService>("AuthService").to(AuthServiceImpl).inSingletonScope();
        kernel.bind<HttpService>("HttpService").to(HttpServiceMock).inSingletonScope();
        var authService = kernel.get<AuthService>("AuthService");
        
        // ARRANGE        
        let req : Request;
        let resp : Response;
        let next: NextFunction; 
        resp = {
            status: (aa) => { return this; }, 
            send: (aa) => { return this; },
            end: () => {}
        }  
         
        
        // ACT
        authService.getVersion(req, resp, next); 
        
        // ASSERT
        //expect(resp.json).to.be.equals("Yes men"); 
              
    });
  });
}); 