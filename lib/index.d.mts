import { MqttClient } from 'mqtt';

type BodyType = Record<string, any>;
type HeaderType = {
    authorization?: string;
    "content-type"?: string;
    "content-length"?: number;
    "user-agent"?: string;
    "cache-control"?: string;
};

declare class Request {
    qs?: Record<string, string>;
    headers?: HeaderType;
    body?: BodyType;
    url?: string;
    method?: string;
    buffer?: Buffer;
    ctx?: Record<string, any>;
    constructor(topic: string, message: string);
}

type StatusCode = 100 | 101 | 102 | 103 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;

declare class Response {
    protected topic: string;
    protected mqttClient: MqttClient;
    protected logs: boolean;
    protected hasSent: boolean;
    constructor(mqttClient: MqttClient, topic: string, logs?: boolean);
    /**
     * @Description Sends a response to the client, advised to use the specific method for the response based on the status code
     * @param body
     * @param code
     */
    send(body: Record<string, any>, code?: StatusCode): void;
    /**
     * @Description Sends a response to the client with a buffer instead of a json object
     * @param buffer
     * @param code
     */
    sendBuffer(buffer: Buffer, code?: StatusCode): void;
    continue(body: Record<string, any>): void;
    switchingProtocols(body: Record<string, any>): void;
    processing(body: Record<string, any>): void;
    earlyHints(body: Record<string, any>): void;
    ok(body: Record<string, any>): void;
    created(body: Record<string, any>): void;
    accepted(body: Record<string, any>): void;
    nonAuthoritativeInformation(body: Record<string, any>): void;
    noContent(body: Record<string, any>): void;
    resetContent(body: Record<string, any>): void;
    partialContent(body: Record<string, any>): void;
    multiStatus(body: Record<string, any>): void;
    alreadyReported(body: Record<string, any>): void;
    imUsed(body: Record<string, any>): void;
    multipleChoices(body: Record<string, any>): void;
    movedPermanently(body: Record<string, any>): void;
    found(body: Record<string, any>): void;
    seeOther(body: Record<string, any>): void;
    notModified(body: Record<string, any>): void;
    useProxy(body: Record<string, any>): void;
    switchProxy(body: Record<string, any>): void;
    temporaryRedirect(body: Record<string, any>): void;
    permanentRedirect(body: Record<string, any>): void;
    badRequest(body: Record<string, any>): void;
    unauthorized(body: Record<string, any>): void;
    paymentRequired(body: Record<string, any>): void;
    forbidden(body: Record<string, any>): void;
    notFound(body: Record<string, any>): void;
    methodNotAllowed(body: Record<string, any>): void;
    notAcceptable(body: Record<string, any>): void;
    proxyAuthenticationRequired(body: Record<string, any>): void;
    requestTimeout(body: Record<string, any>): void;
    conflict(body: Record<string, any>): void;
    gone(body: Record<string, any>): void;
    lengthRequired(body: Record<string, any>): void;
    preconditionFailed(body: Record<string, any>): void;
    payloadTooLarge(body: Record<string, any>): void;
    uriTooLong(body: Record<string, any>): void;
    unsupportedMediaType(body: Record<string, any>): void;
    rangeNotSatisfiable(body: Record<string, any>): void;
    expectationFailed(body: Record<string, any>): void;
    imATeapot(body: Record<string, any>): void;
    misdirectedRequest(body: Record<string, any>): void;
    unprocessableEntity(body: Record<string, any>): void;
    locked(body: Record<string, any>): void;
    failedDependency(body: Record<string, any>): void;
    tooEarly(body: Record<string, any>): void;
    upgradeRequired(body: Record<string, any>): void;
    preconditionRequired(body: Record<string, any>): void;
    tooManyRequests(body: Record<string, any>): void;
    requestHeaderFieldsTooLarge(body: Record<string, any>): void;
    unavailableForLegalReasons(body: Record<string, any>): void;
    internalServerError(body: Record<string, any>): void;
    notImplemented(body: Record<string, any>): void;
    badGateway(body: Record<string, any>): void;
    serviceUnavailable(body: Record<string, any>): void;
    gatewayTimeout(body: Record<string, any>): void;
    httpVersionNotSupported(body: Record<string, any>): void;
    variantAlsoNegotiates(body: Record<string, any>): void;
    insufficientStorage(body: Record<string, any>): void;
    loopDetected(body: Record<string, any>): void;
    notExtended(body: Record<string, any>): void;
    networkAuthenticationRequired(body: Record<string, any>): void;
    /**
     * @description Returns if the response has been sent to the client - only one response can be sent, if you return something in a middleware, all the chain of middlewares and the controller will be stopped
     */
    hasBeenSent(): boolean;
    private parseResponse;
}

interface ServerOptions {
    host: string;
    port: number;
    username?: string;
    password?: string;
    reconnectionRetries?: number;
    logs?: boolean;
}
type ControllerType = (req: Request, res: Response) => Promise<void>;
type MiddlewareType = (req: Request, res: Response) => Promise<void>;
type ApiType = {
    controller: ControllerType;
    middlewares?: MiddlewareType[];
};
type ApiRouteType = {
    [path: `SERVER/${HttpMethodType}/${string}`]: ApiType;
};

declare class Router {
    protected internalPrefix?: string;
    protected middlewares?: MiddlewareType[];
    routes: ApiRouteType;
    constructor(prefix?: string, middlewares?: MiddlewareType[]);
    group(cb: (router: Router) => void, prefix?: string, middlewares?: MiddlewareType[]): Router;
    get(path: string, controller: ControllerType, middlewares?: MiddlewareType[]): void;
    post(path: string, controller: ControllerType, middlewares?: MiddlewareType[]): void;
    put(path: string, controller: ControllerType, middlewares?: MiddlewareType[]): void;
    patch(path: string, controller: ControllerType, middlewares?: MiddlewareType[]): void;
    delete(path: string, controller: ControllerType, middlewares?: MiddlewareType[]): void;
    protected applyRoutes(router: Router): void;
}
declare const _default: Router;

declare class Server {
    readonly port: number;
    readonly host: string;
    protected readonly username?: string;
    protected readonly password?: string;
    reconnectionRetries: number;
    protected mqttClient: MqttClient;
    protected url: string;
    protected routes: ApiRouteType;
    protected logs: boolean;
    constructor(options: ServerOptions);
    connect(): Promise<void>;
    disconnect(): void;
    get(path: string, controller: ControllerType, middlewares?: MiddlewareType[]): void;
    post(path: string, controller: ControllerType, middlewares?: MiddlewareType[]): void;
    put(path: string, controller: ControllerType, middlewares?: MiddlewareType[]): void;
    patch(path: string, controller: ControllerType, middlewares?: MiddlewareType[]): void;
    delete(path: string, controller: ControllerType, middlewares?: MiddlewareType[]): void;
    applyRouter(router: Router): void;
    private assignRoutes;
    private setTopicListener;
    private setBaseEvents;
    private checkConnection;
}

type FlynestClientOptions = {
    mqttClient?: MqttClient;
    brokerHost?: string;
    port?: number;
    brokerUrl?: string;
    username?: string;
    password?: string;
    logs?: boolean;
};

declare class ClientResponse {
    protected topic: string;
    protected data: Object | Buffer;
    constructor(topic: string, body: Object | Buffer);
}

declare class FlynestClient {
    protected mqttClient: MqttClient;
    protected brokerHost?: string;
    protected port?: number;
    protected brokerUrl?: string;
    protected username?: string;
    protected password?: string;
    protected logs: boolean;
    /**
     * @Description Creates a new FlynestClient - for the broker you can use either broker host or broker url, mqttClient takes precedence, then broker url and finally broker host
     * @param options {FlynestClientOptions}
     */
    constructor(options: FlynestClientOptions);
    get(path: string, { headers, queryParams, }: {
        headers?: HeaderType;
        queryParams?: Record<string, string>;
    }): Promise<ClientResponse>;
    post(path: string, { headers, body, buffer, queryParams, }: {
        headers?: HeaderType;
        body?: BodyType;
        buffer?: Buffer;
        queryParams?: Record<string, string>;
    }): Promise<ClientResponse>;
    patch(path: string, { headers, body, queryParams, }: {
        headers?: HeaderType;
        body?: BodyType;
        queryParams?: Record<string, string>;
    }): Promise<ClientResponse>;
    put(path: string, { headers, body, queryParams, }: {
        headers?: HeaderType;
        body?: BodyType;
        queryParams?: Record<string, string>;
    }): Promise<ClientResponse>;
    delete(path: string, { headers, queryParams, }: {
        headers?: HeaderType;
        queryParams?: Record<string, string>;
    }): Promise<ClientResponse>;
    private awaitRequest;
}

export { FlynestClient, Request, Response, _default as Router, Server };
