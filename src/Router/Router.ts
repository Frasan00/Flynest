import {
  ApiRouteType,
  ControllerType,
  HttpMethodType,
  MiddlewareType,
} from "../Server/ServerTypes";
import { checkDuplicateTopic, validatePath } from "../Utils";

export class Router {
  protected internalPrefix?: string;
  public routes: ApiRouteType = {};

  constructor(prefix?: string) {
    this.internalPrefix = prefix ? validatePath(prefix) : undefined;
  }

  public group(cb: (router: Router) => void, prefix?: string): this {
    const router = new Router(prefix);
    cb(router);
    this.applyRoutes(router);
    return this;
  }

  public get(
    path: string,
    controller: ControllerType,
    middlewares?: MiddlewareType[],
  ): void {
    if (this.internalPrefix) {
      path = validatePath(`${this.internalPrefix}${path}`);
    }

    checkDuplicateTopic(`SERVER/${HttpMethodType.GET}${path}`, this.routes);
    Object.assign(this.routes, {
      [`SERVER/${HttpMethodType.GET}${path}`]: {
        controller,
        middlewares,
      },
    });
  }

  public post(
    path: string,
    controller: ControllerType,
    middlewares?: MiddlewareType[],
  ): void {
    if (this.internalPrefix) {
      path = validatePath(`${this.internalPrefix}${path}`);
    }

    console.log(path);
    checkDuplicateTopic(`SERVER/${HttpMethodType.POST}${path}`, this.routes);
    Object.assign(this.routes, {
      [`SERVER/${HttpMethodType.POST}${path}`]: {
        controller,
        middlewares,
      },
    });
  }

  public put(
    path: string,
    controller: ControllerType,
    middlewares?: MiddlewareType[],
  ): void {
    if (this.internalPrefix) {
      path = validatePath(`${this.internalPrefix}${path}`);
    }

    checkDuplicateTopic(`SERVER/${HttpMethodType.PUT}${path}`, this.routes);
    Object.assign(this.routes, {
      [`SERVER/${HttpMethodType.PUT}${path}`]: {
        controller,
        middlewares,
      },
    });
  }

  public patch(
    path: string,
    controller: ControllerType,
    middlewares?: MiddlewareType[],
  ): void {
    if (this.internalPrefix) {
      path = validatePath(`${this.internalPrefix}${path}`);
    }

    checkDuplicateTopic(`SERVER/${HttpMethodType.PATCH}${path}`, this.routes);
    Object.assign(this.routes, {
      [`SERVER/${HttpMethodType.PATCH}${path}`]: {
        controller,
        middlewares,
      },
    });
  }

  public delete(
    path: string,
    controller: ControllerType,
    middlewares?: MiddlewareType[],
  ): void {
    if (this.internalPrefix) {
      path = validatePath(`${this.internalPrefix}${path}`);
    }

    checkDuplicateTopic(`SERVER/${HttpMethodType.DELETE}${path}`, this.routes);
    Object.assign(this.routes, {
      [`SERVER/${HttpMethodType.DELETE}${path}`]: {
        controller,
        middlewares,
      },
    });
  }

  protected applyRoutes(router: Router) {
    Object.keys(router.routes).forEach((key) => {
      checkDuplicateTopic(key, this.routes);
      Object.assign(this.routes, {
        [key]: router.routes[key as keyof ApiRouteType],
      });
    });
  }
}

export default new Router();
