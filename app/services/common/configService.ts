import { injectable, inject } from "inversify";
import * as fs from "fs";

export interface ConfigService {
    config : any;
}

@injectable()
export class ConfigServiceImpl implements ConfigService {
    
    public config : any;
    
    constructor() {
        this.config = JSON.parse(fs.readFileSync('/Users/mco/Documents/Projects/myWays/MyWayServer/app/config/config.json', 'utf8'));
    }
} 