
import { injectable, inject } from "inversify";
import { HttpService } from "./services/httpService";
import { AuthService } from "./services/authService";

export interface Main {
    start(): void;
}

@injectable()
export class MainImpl implements Main {

    public constructor(
        @inject("HttpService") private httpService: HttpService,
        @inject("AuthService") private authService: AuthService) {
    }

    public start(): void {
        // Start services
        this.httpService.startRestServer();
           
    }
}

