import {
  ApiRouteType,
  ControllerType,
  HttpMethodType,
  MiddlewareType,
} from "../ServerTypes";
import { checkDuplicateTopic, validatePath } from "../../Utils";

export class Router {
  protected internalPrefix?: string;
  protected middlewares?: MiddlewareType[];
  public routes: ApiRouteType = {};

  constructor(prefix?: string, middlewares?: MiddlewareType[]) {
    this.internalPrefix = prefix ? validatePath(prefix) : undefined;
    this.middlewares = middlewares;
  }

  public group(
    cb: (router: Router) => void,
    prefix?: string,
    middlewares?: MiddlewareType[],
  ): Router {
    const newPrefix = `${this.internalPrefix || ""}/${prefix || ""}`;
    const newMiddlewares = [
      ...(this.middlewares ?? []),
      ...(middlewares ?? []),
    ];
    const router = new Router(
      newPrefix === "/" ? undefined : validatePath(newPrefix),
      newMiddlewares,
    );
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
        controller: controller,
        middlewares: [...(this.middlewares ?? []), ...(middlewares ?? [])],
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
        controller: controller,
        middlewares: [...(this.middlewares ?? []), ...(middlewares ?? [])],
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
        controller: controller,
        middlewares: [...(this.middlewares ?? []), ...(middlewares ?? [])],
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
        controller: controller,
        middlewares: [...(this.middlewares ?? []), ...(middlewares ?? [])],
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
        controller: controller,
        middlewares: [...(this.middlewares ?? []), ...(middlewares ?? [])],
      },
    });
  }

  protected applyRoutes(router: Router) {
    console.log(router);
    Object.keys(router.routes).forEach((key) => {
      checkDuplicateTopic(key, this.routes);
      Object.assign(this.routes, {
        [key]: {
          controller: router.routes[key as keyof ApiRouteType].controller,
          middlewares: router.routes[key as keyof ApiRouteType].middlewares,
        },
      });
    });
  }
}

export default new Router();
