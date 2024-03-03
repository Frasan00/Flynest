import Request from "../Request/Request";
import Response from "../Response/Response";

export interface ServerOptions {
  host: string;
  port: number;
  username?: string;
  password?: string;
  reconnectionRetries?: number;
  logs?: boolean;
}

export type ControllerType = (req: Request, res: Response) => Promise<void>;
export type MiddlewareType = (req: Request, res: Response) => Promise<void>;

export enum HttpMethodType {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export type ApiType = {
  controller: ControllerType;
  middlewares?: MiddlewareType[];
};

export type ApiRouteType = {
  [path: `SERVER/${HttpMethodType}/${string}`]: ApiType;
};
