
import "reflect-metadata";
import { Kernel } from "inversify";
import { Main, MainImpl } from "./main";

import { ConfigService, ConfigServiceImpl } from "./services/common/configService";
import { HttpService, HttpServiceImpl } from "./services/common/httpService";
import { DBService, DBServiceImpl } from "./services/common/dbService";

import { AuthService, AuthServiceImpl } from "./services/authService";
import { UserService, UserServiceImpl } from "./services/userService";
import { ProviderService, ProviderServiceImpl } from "./services/providerService";

// Create and configure application injector
var injector = new Kernel();

injector.bind<Main>("Main").to(MainImpl); 
injector.bind<ConfigService>("ConfigService").toValue(new ConfigServiceImpl());
injector.bind<HttpService>("HttpService").to(HttpServiceImpl).inSingletonScope(); 
injector.bind<DBService>("DBService").to(DBServiceImpl).inSingletonScope(); 

injector.bind<AuthService>("AuthService").to(AuthServiceImpl).inSingletonScope(); 
injector.bind<UserService>("UserService").to(UserServiceImpl).inSingletonScope(); 
injector.bind<ProviderService>("ProviderService").to(ProviderServiceImpl).inSingletonScope(); 

export default injector;
