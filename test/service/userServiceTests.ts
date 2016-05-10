/// <reference path="../testRefPath.ts"/>

import "reflect-metadata";
import { Kernel } from "inversify";
import { Express, Request, Response, NextFunction, Send } from "express";
import { UserService, UserServiceImpl } from "../../app/services/userService";
import { HttpService } from "../../app/services/common/httpService";
import { injectable, inject } from "inversify";

import { expect, assert } from 'chai';
import { stub } from 'sinon';
import { HttpServiceMock } from '../common/httpServiceMock';


describe('UserServiceTestSuite', function () {

    // Create the injector
    let kernel = new Kernel();
    kernel.bind<UserService>("UserService").to(UserServiceImpl);
    kernel.bind<HttpService>("HttpService").to(HttpServiceMock).inSingletonScope();

    describe('UserService', function () {
        it('getUser', function () {
            
            // Get the userService
            var userService = kernel.get<UserService>("UserService");
            
            // ARRANGE
            let req : Request = <Request> {};
            req.params = {'id' : 'toto'};
            
            let resp : Response = <Response> {};
            resp.status = (code: number) : Response => { return resp; };
            resp.send = (body: any) : Response => { return resp; }
            
            // ACT
            userService.getOwnUser(req, resp); 
            
            // ASSERT
            
        });
    });
});