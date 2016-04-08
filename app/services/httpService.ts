import { injectable, inject } from "inversify";
import { ConfigService } from "./configService";
import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import * as http from "http";

export interface HttpService {
    start(): Promise<{}>;
}

@injectable()
export class HttpServiceImpl implements HttpService {

    private express;
    private configService: ConfigService;

    public constructor( @inject("ConfigService") configService) {
        this.express = express();
        this.configService = configService;
    }

    public start(): Promise<{}> {
        console.info('[HTTPSERVICE] Starting');
        this.configureExpress();
        this.configureCors();
        return this.configureHttpServer();
    }

    private configureExpress(): void {
        console.info("[HTTPSERVICE] -- Configure express framework")
        this.express.set('port', this.configService.config.http.port);
        this.express.use(morgan('logger'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
    }

    private configureCors(): void {
        console.info("[HTTPSERVICE] -- Enable CORS");
        this.express.use(function(req, res, next) {
            // Check request origin and configure Access-Control-Allow-* headers
            var reqOrigin = req.get('Origin')
            if (this.configService.config.http.allowedOrigins.indexOf(reqOrigin) != -1)
                res.setHeader('Access-Control-Allow-Origin', reqOrigin);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });
    }

    private configureHttpServer(): Promise<any> {
        console.info(`[HTTPSERVICE] -- Start the REST server on port ${this.express.get('port')}`);
        return new Promise((resolve, reject) => {
            var server = http.createServer(this.express).listen(this.express.get('port'), () => {
                console.info('[HTTPSERVICE] Started');
                resolve();
            });
        });
    }
} 
