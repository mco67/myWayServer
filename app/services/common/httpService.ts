import { injectable, inject } from "inversify";
import { ConfigService } from "./configService";
import { DBService } from "./dbService";
import { Express, RequestHandler } from "express";
import { Passport, Strategy } from "passport";
import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import * as http from "http";

// No typings for the followings modules
var BasicStrategy = require('passport-http').BasicStrategy;

export interface HttpService {
    startRestServer(): Promise<{}>;
    addGetRoute(path: string, ...handler: RequestHandler[]);
    addPostRoute(path: string, ...handler: RequestHandler[]);
    addDeleteRoute(path: string, ...handler: RequestHandler[]);
}


@injectable()
export class HttpServiceImpl implements HttpService {

    private express: Express;
    private passport: Passport;

    constructor(
        @inject("ConfigService") private configService: ConfigService,
        @inject("DBService") private dbService: DBService) {
            this.configureExpress();
            this.configurePassportBasicAuth();
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

    private configureExpress(): void {
        console.info("[HTTPSERVICE] -- Configure express framework");

        // Configure Express framework
        this.express = express();
        this.express.set('port', this.configService.config.http.port);
        this.express.use(morgan('logger'));
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
        let basicStrategy: Strategy = new BasicStrategy((phone, token, done) => {
            try {
                return done(false, null);
            }
            catch (err) {
                console.error('[HTTPSERVICE] -- Passport BasicStrategy error " + error.message')
            }
        });
        this.passport.use(basicStrategy);
    }

    public addGetRoute(path: string, ...handler: RequestHandler[]) {
        this.express.get(path, ...handler);
    }
    
    public addPostRoute(path: string, ...handler: RequestHandler[]) {
        this.express.post(path, ...handler);
    }
    
    public addDeleteRoute(path: string, ...handler: RequestHandler[]) {
        this.express.delete(path, ...handler);
    }

} 
