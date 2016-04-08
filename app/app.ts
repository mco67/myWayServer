/// <reference path="../node_modules/inversify/type_definitions/inversify/inversify.d.ts" />
/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../typings/main/ambient/express-serve-static-core/index.d.ts" />
/// <reference path="../typings/main/ambient/express/index.d.ts" />
/// <reference path="../typings/main/ambient/mime/index.d.ts" />
/// <reference path="../typings/main/ambient/serve-static/index.d.ts" />
/// <reference path="../typings/main/ambient/node/index.d.ts" />
/// <reference path="../typings/main/ambient/morgan/index.d.ts" />
/// <reference path="../typings/main/ambient/body-parser/index.d.ts" />

import { Main } from "./main";
import injector from "./inversify.config";

// Bootstrap application
var main = injector.get<Main>("Main");
main.start();