import { injectable, inject } from "inversify";

export interface DBService {
}

@injectable()
export class DBServiceImpl implements DBService {
          
    constructor() {
        console.log('[DBSERVICE] -- Configure Database');  
    }
}  