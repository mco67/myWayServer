import "reflect-metadata";
import { HttpService } from "../../app/services/common/httpService";
import { injectable, inject } from "inversify";

@injectable()
export class HttpServiceMock implements HttpService {
    public startRestServer() : Promise<any> {
        return null;
    }
    
    public addGetRoute() {};
    public addPostRoute() {};
    public addDeleteRoute() {};
}
