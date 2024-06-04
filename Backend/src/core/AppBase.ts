import express, { Express, Router, type Request, type Response, Application, NextFunction } from "express";
import { log } from "console";

type AppClassConstructor<BaseClass> = { new(...args: any[]): BaseClass };
type MiddlewareHandler = (request: Request, response: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
type RouteHandler = (request: Request, response: Response) => void | Response<any, Record<string, any>>;
const AllowedMethods = ["get", "post", "delete", "put", "all"];
interface _ClassDecoratorOptionsInterface {
    Middlewares?: MiddlewareHandler[] | undefined,
}

interface AppServerOptions extends _ClassDecoratorOptionsInterface {
    Apps: AppBase[]
}

abstract class AppServerBase {
    constructor() { }
    App: Express | undefined;
}

interface AppOptions extends _ClassDecoratorOptionsInterface {
    BaseUrl: string
}

abstract class AppBase {
    App: Router | undefined;
    BaseUrl: string | undefined;
}


interface AppRouteOptions extends _ClassDecoratorOptionsInterface {
    Method: string
    Url: string
}

class AppServerError extends Error {
    constructor() {
        super("No Apps Declared to be mounted")
    }
}

class AppRouterError extends Error {
    constructor(name: string, method: string) {
        super(`Method ${method} for function ${name} is invalid`)
    }
}

type RouteHandlerPropertyDescriptor = TypedPropertyDescriptor<RouteHandler>

class RouteConfig implements AppRouteOptions {
    Method: string;
    Url: string;
    Middlewares?: MiddlewareHandler[] | undefined;
    Name: string

    constructor(Name: string, { Method, Url, Middlewares }: AppRouteOptions) {
        this.Name = Name
        this.Method = Method
        this.Middlewares = Middlewares
        this.Url = Url
    }
}

abstract class _ServerSetup {

    public static SetupApps(This: AppServerBase, Apps: AppBase[]) {
        let mounted_apps = false;
        for (let AppMount of Apps) {
            log(`mounting app ${AppMount.BaseUrl}`);
            This.App?.use(AppMount.BaseUrl as string, AppMount.App as Application)
            mounted_apps = true;
        }
        This.App?.use((error: any, _request: Request, response: Response, _next: NextFunction) => {
            response.status(400).send({message: error.message})
        })
        if (mounted_apps) {
            _ServerSetup.StartServer(This)
        } else {
            throw new AppServerError();
        }
    }

    private static StartServer(This: AppServerBase) {

        This.App?.listen(443, () => {
            console.log("Server Running on port: 443");
        })
    }
}

function AppServer({ Middlewares, Apps }: AppServerOptions) {
    return function _appServer<T extends AppClassConstructor<AppServerBase>>(Base: T) {
        return class extends Base {
            constructor(...args: any[]) {
                super(...args)
                this.App = express();
                this.App?.use(express.json())
                if (Middlewares) {
                    this.App?.use(Middleware.Setup(Middlewares));
                }
                _ServerSetup.SetupApps(this, Apps)
            }
        }
    }
}


abstract class _AppSetup {

    public static SetSingleRoute(This: AppBase, AppPrototye: { [key: string]: any }) {
        if (AppPrototye["__app_routes"] != undefined) {
            let singleAppRoutes: RouteConfig[] = AppPrototye["__app_routes"];
            for (let idx = 0; idx < AppPrototye["__app_routes"].length; idx++) {
                let appRoute = singleAppRoutes[idx];
                if (AllowedMethods.find((method) => { return appRoute.Method == method })) {
                    if ((Middleware.Setup(appRoute.Middlewares) as MiddlewareHandler[]).length > 0) {
                        (This.App as { [key: string]: any })[appRoute.Method](
                            singleAppRoutes[idx].Url,
                            appRoute.Middlewares)
                    }
                    (This.App as { [key: string]: any })[appRoute.Method](
                        singleAppRoutes[idx].Url,
                        (This as { [key: string]: any })[appRoute.Name])
                    
                } else {
                    throw new AppRouterError(singleAppRoutes[idx].Name, singleAppRoutes[idx].Method)
                }
            }
        }
    }
}


function App({ BaseUrl, Middlewares }: AppOptions) {
    return function _app<T extends AppClassConstructor<AppBase>>(Base: T) {
        console.log(Base.prototype)
        return class extends Base {
            constructor(...args: any[]) {
                super(args);
                this.App = express.Router();
                if ((Middleware.Setup(Middlewares) as MiddlewareHandler[]).length > 0) {
                    this.App?.use(Middleware.Setup(Middlewares));
                }
                _AppSetup.SetSingleRoute(this, Base.prototype)
                this.BaseUrl = BaseUrl;
            }
        }
    }
}

function AppRoute({ Method, Url, Middlewares }: AppRouteOptions) {
    return function (target: { [key: string]: any }, name: string, _descr: RouteHandlerPropertyDescriptor) {
        if (target["__app_routes"] == undefined) {
            target["__app_routes"] = []
        }
        target["__app_routes"].push(new RouteConfig(name, { Method, Url, Middlewares: Middleware.Setup(Middlewares) }))
    }
}


abstract class Middleware {

    static Setup(middlewares: MiddlewareHandler | MiddlewareHandler[] | undefined): MiddlewareHandler[] {
        let _mids: MiddlewareHandler[] = []
        if (middlewares === undefined) return _mids;
        if (!(middlewares instanceof Array)) {
            middlewares = [middlewares] as MiddlewareHandler[];
        }
        for (let _m of middlewares) {
            _mids.push(_m)
        }
        return _mids;
    }
}

export { App, Middleware, AppServer, AppBase, AppServerBase, AppRoute };
export type { AppServerOptions, MiddlewareHandler, RouteHandler };
