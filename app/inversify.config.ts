
import "reflect-metadata";
import { Kernel } from "inversify";
import { Main, MainImpl } from "./main";
import { ConfigService, ConfigServiceImpl } from "./services/configService";
import { HttpService, HttpServiceImpl } from "./services/httpService";
import { AuthService, AuthServiceImpl } from "./services/authService";

// Create and configure application injector
var injector = new Kernel();

injector.bind<Main>("Main").to(MainImpl); 
injector.bind<ConfigService>("ConfigService").toValue(new ConfigServiceImpl());
injector.bind<HttpService>("HttpService").to(HttpServiceImpl).inSingletonScope(); 
injector.bind<AuthService>("AuthService").to(AuthServiceImpl).inSingletonScope(); 

export default injector;
