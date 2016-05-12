
import { injectable, inject } from "inversify";
import { HttpService } from "./services/common/httpService";
import { UserService } from "./services/userService";
import { AuthService } from "./services/authService";

export interface Main {
    start(): void;
}

@injectable()
export class MainImpl implements Main {

    public constructor(
        @inject("HttpService") private httpService: HttpService,
        @inject("UserService") private userService: UserService,
        @inject("AuthService") private authService: AuthService) {}
 
    public start(): void { 
        this.httpService.startRestServer();
    }
}

