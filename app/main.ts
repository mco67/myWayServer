
import { injectable, inject } from "inversify";
import { HttpService } from "./services/httpService";

export interface Main {
    start(): void;
}

@injectable()
export class MainImpl implements Main {

    private httpService: HttpService;

    public constructor( @inject("HttpService") httpService) {
        this.httpService = httpService;
    }

    public start(): void {
        console.info('---------------------------------------------------------');
        console.info('-- MyApp server                                        --');
        console.info('---------------------------------------------------------');
        console.info('[MAIN] Starting');

        // Start services
        this.httpService.start()
            .then(() => {
                console.info('[MAIN] Started');
            });
    }
}

