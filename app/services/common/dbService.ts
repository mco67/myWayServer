import { injectable, inject } from "inversify";
import { ConfigService } from "./configService";

import * as mongoose from 'mongoose'; 

export interface DBService {
}

@injectable()
export class DBServiceImpl implements DBService {
        
    private mongoose : mongoose.Mongoose;  
       
    constructor(@inject("ConfigService") private configService: ConfigService) {
        this.mongoose = mongoose;
        this.mongoose.connect(configService.config.db.url, function(error) {
            if (error) console.log(`[DBSERVICE]   -- Connection to database failure : ${error}`);
            else console.log('[DBSERVICE]   -- Connection to database success');
        });        
    } 
}  