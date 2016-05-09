/// <reference path="../testRefPath.ts"/>

import "reflect-metadata";
import { Kernel } from "inversify";
import { Express, Request, Response, NextFunction, Send } from "express";
import { AuthService, AuthServiceImpl } from "../../app/services/authService";
import { HttpService } from "../../app/services/common/httpService";
import { injectable, inject } from "inversify";

import { expect, assert } from 'chai';
import { stub } from 'sinon';
import { HttpServiceMock } from '../common/httpServiceMock';


describe('AuthenticationService', function() {
  describe('authService', function () {
    it('should return version info', function () {
        
        // Create the authentication service
        let kernel = new Kernel();
        kernel.bind<AuthService>("AuthService").to(AuthServiceImpl).inSingletonScope();
        kernel.bind<HttpService>("HttpService").to(HttpServiceMock).inSingletonScope();
        var authService = kernel.get<AuthService>("AuthService");
       
        // ARRANGE        
        let req : Request = <Request> {};
        let next: NextFunction = <NextFunction> {};
           
        let resp : Response = <Response> {};
        resp.status = (code: number) : Response => { return resp; };
        resp.send = (body: any) : Response => { return resp; }
                
        var astub = stub(resp, "send");        
                
                
        // ACT
        //authService.getVersion(req, resp, next);  
        
        // ASSERT
        //assert(astub.calledOnce);
        //assert(astub.calledWith("Yes men"), "astub.calledWith('Yes men')");  
  
    });
  });
}); 