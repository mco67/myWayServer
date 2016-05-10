import "reflect-metadata";
import { HttpService } from "../../app/services/common/httpService";
import { injectable, inject } from "inversify";
import { Passport, Strategy } from "passport";

@injectable()
export class HttpServiceMock implements HttpService {
    
    passport : Passport;
    
    public startRestServer() : Promise<any> {
        return null;
    }
    public encodeToken(login: string): string {
        return null;
    }
    public addGetRoute() {};
    public addPostRoute() {};
    public addOptionsRoute() {};
    public addDeleteRoute() {};
    public forgeErrorMessage(errCode: string, errMsg: string, errDetails: string, errDetailsCode: string): any {};
}
