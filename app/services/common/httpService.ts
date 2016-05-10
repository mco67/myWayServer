import { injectable, inject } from "inversify";
import { ConfigService } from "./configService";
import { DBService } from "./dbService";
import { Express, RequestHandler } from "express";
import { Passport } from "passport";
import { User, UserSchema } from "../../models/user";

import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as jwt from "jwt-simple";

// No typings for the followings modules
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

export interface HttpService {

    passport: Passport;
    startRestServer(): Promise<{}>;
    encodeToken(login: string): string;
    forgeErrorMessage(errCode: string, errMsg: string, errDetails: string, errDetailsCode: string): any;
    
    addGetRoute(path: string, ...handler: RequestHandler[]);
    addPostRoute(path: string, ...handler: RequestHandler[]);
    addOptionsRoute(path: string, ...handler: RequestHandler[]);
    addDeleteRoute(path: string, ...handler: RequestHandler[]);
}


@injectable()
export class HttpServiceImpl implements HttpService {

    private express: Express;
    public passport: Passport;
    public tokenSecret: string;

    constructor(
        @inject("ConfigService") private configService: ConfigService,
        @inject("DBService") private dbService: DBService) {
        this.tokenSecret = "YaSeli67";
        this.configureExpress();
        this.configurePassportBasicAuth();
        this.configurePassportBearer();
        this.configureCors();
    }

    public startRestServer(): Promise<any> {
        return new Promise((resolve, reject) => {
            var server = http.createServer(this.express).listen(this.express.get('port'), (info) => {
                console.info(`[HTTPSERVICE] -- REST server started on port ${this.express.get('port')}`);
                resolve();
            });
        });
    }

    public encodeToken(login: string): string {
        console.log(`[HTTPSERVICE] -- Encode auth token for user ${login}`);
        return jwt.encode({ username: login }, this.tokenSecret);
    }

    private configureExpress(): void {
        console.info("[HTTPSERVICE] -- Configure express framework");

        // Configure Express framework
        this.express = express();
        this.express.set('port', this.configService.config.http.port);
        this.express.use(morgan('common'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));

        // Attach Password framework
        this.passport = require('passport');
        this.express.use(this.passport.initialize());
    }

    private configureCors(): void {
        console.info("[HTTPSERVICE] -- Enable CORS");
        var allowedOrigins = this.configService.config.http.allowedOrigins;
        this.express.use((req, res, next) => {
            // Check request origin and configure Access-Control-Allow-* headers
            var reqOrigin = req.get('Origin');
            if (allowedOrigins.indexOf(reqOrigin) != -1)
                res.setHeader('Access-Control-Allow-Origin', reqOrigin);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        });
    }

    private configurePassportBasicAuth(): void {
        console.info("[HTTPSERVICE] -- Configure passport basicAuth strategy");
        let basicStrategy = new BasicStrategy((username, password, done) => {
            try {
                User.findOne({ login: username }, (err, user) => {
                    if (user) {
                        user.verifyPassword(password, (err, valid) => {
                            if (err || !valid) { return done('wrongPassword', null); }
                            return done(false, user);
                        });
                    }
                    else { return done("wrongUser", null); }
                });
            }
            catch (err) {
                console.error('[HTTPSERVICE] -- Passport BasicStrategy error " + err.message');
                return done(false, null);
            }
        });
        this.passport.use(basicStrategy);
    }

    private configurePassportBearer(): void {
        console.info("[HTTPSERVICE] -- Configure passport bearer strategy");
        let bearerStrategy = new BearerStrategy((token, done) => {
            try {
                // We attempt to decode the token the user sends with his requests
                var decoded = jwt.decode(token, this.tokenSecret);
                var username = decoded.username;

                User.findOne({ login: username }, (err, user) => {
                    if (err) { return done(err); }
                    if (user) { return done(null, user); }
                    else {
                        console.error('[HTTPSERVICE] -- Passport Bearer error : wrong token');
                        return done(null, false);
                    }
                });
            }
            catch (err) {
                console.error('[HTTPSERVICE] -- Passport Bearer error " + err.message');
                return done(false, null);
            }
        });
        this.passport.use(bearerStrategy);
    }


    public addGetRoute(path: string, ...handler: RequestHandler[]) {
        this.express.get(path, ...handler);
    }

    public addPostRoute(path: string, ...handler: RequestHandler[]) {
        this.express.post(path, ...handler);
    }

    public addOptionsRoute(path: string, ...handler: RequestHandler[]) {
        this.express.options(path, ...handler);
    }

    public addDeleteRoute(path: string, ...handler: RequestHandler[]) {
        this.express.delete(path, ...handler);
    }

    public forgeErrorMessage(errCode: string, errMsg: string, errDetails: string, errDetailsCode: string): any {
        return {
            "errorCode": errCode,
            "errorMsg": errMsg,
            "errorDetails": errDetails,
            "errorDetailsCode": errCode + errDetailsCode
        }
    }

} 
