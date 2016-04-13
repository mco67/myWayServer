/// <reference path="../testRefPath.ts"/>

import { Kernel } from "inversify";
import { AuthService, AuthServiceImpl } from "../../app/services/authService";
import { HttpService } from "../../app/services/httpService";

class HttpServiceMock implements HttpService {
    public startRestServer() : Promise<any> {
        return null;
    }
    
    public addGetRoute() {
        console.log("cocuocu");
    }
}

describe('AuthenticationService', function() {
  describe('authService', function () {
    it('should return version info', function () {
        
        let kernel = new Kernel();
        kernel.bind<AuthService>("AuthService").to(AuthServiceImpl).inSingletonScope();
        kernel.bind<HttpService>("HttpService").to(HttpServiceMock).inSingletonScope();
        
        var authService = kernel.get<AuthService>("AuthService");
        
    });
  });
}); 