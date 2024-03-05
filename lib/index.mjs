var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/Server/Server.ts
import mqtt from "mqtt";

// Logger.ts
import winston from "winston";
var colors = {
  info: "\x1B[32m",
  warn: "\x1B[33m",
  error: "\x1B[31m"
};
var logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp }) => {
    const color = colors[level] || "\x1B[0m";
    return `${timestamp} ${color}${level}\x1B[0m: ${color}${message}\x1B[0m`;
  })
);
var consoleTransport = new winston.transports.Console();
var fileTransport = new winston.transports.File({ filename: "logfile.log" });
var logger = winston.createLogger({
  format: logFormat,
  transports: [consoleTransport, fileTransport]
});
function log(message, logs) {
  if (!logs) {
    return;
  }
  logger.info("\nMQTT: \u{1F41D} " + message);
}
function logError(error, message) {
  logger.error(
    "\nMQTT: \u{1F41D} " + message ? `${message}: ${error.message}` : ""
  );
}

// src/Server/Request/Request.ts
var Request = class {
  constructor(topic, message) {
    __publicField(this, "qs");
    __publicField(this, "headers");
    __publicField(this, "body");
    __publicField(this, "url");
    __publicField(this, "method");
    __publicField(this, "buffer");
    __publicField(this, "ctx");
    let requestBody = null;
    if (Buffer.isBuffer(message)) {
      this.buffer = message;
    } else {
      this.url = topic;
      requestBody = JSON.parse(message);
    }
    if (requestBody) {
      this.qs = requestBody.qs;
      this.headers = requestBody.headers;
      this.body = requestBody.body;
      this.method = topic.split("/")[1];
    }
  }
};

// src/Server/Response/Response.ts
var Response = class {
  constructor(mqttClient, topic, logs = false) {
    __publicField(this, "topic");
    __publicField(this, "mqttClient");
    __publicField(this, "logs", false);
    __publicField(this, "hasSent", false);
    this.topic = `CLIENT/${topic.split("/").slice(1).join("/")}`;
    this.mqttClient = mqttClient;
    this.logs = logs;
  }
  /**
   * @Description Sends a response to the client, advised to use the specific method for the response based on the status code
   * @param body
   * @param code
   */
  send(body, code = 200) {
    this.hasSent = true;
    this.mqttClient.publish(this.topic, this.parseResponse(body, code));
    log(`Published: ${this.topic} -> ${body}`, this.logs);
  }
  /**
   * @Description Sends a response to the client with a buffer instead of a json object
   * @param buffer
   * @param code
   */
  sendBuffer(buffer, code = 200) {
    this.mqttClient.publish(this.topic, buffer);
  }
  continue(body) {
    this.send(body, 100);
  }
  switchingProtocols(body) {
    this.send(body, 101);
  }
  processing(body) {
    this.send(body, 102);
  }
  earlyHints(body) {
    this.send(body, 103);
  }
  ok(body) {
    this.send(body, 200);
  }
  created(body) {
    this.send(body, 201);
  }
  accepted(body) {
    this.send(body, 202);
  }
  nonAuthoritativeInformation(body) {
    this.send(body, 203);
  }
  noContent(body) {
    this.send(body, 204);
  }
  resetContent(body) {
    this.send(body, 205);
  }
  partialContent(body) {
    this.send(body, 206);
  }
  multiStatus(body) {
    this.send(body, 207);
  }
  alreadyReported(body) {
    this.send(body, 208);
  }
  imUsed(body) {
    this.send(body, 226);
  }
  multipleChoices(body) {
    this.send(body, 300);
  }
  movedPermanently(body) {
    this.send(body, 301);
  }
  found(body) {
    this.send(body, 302);
  }
  seeOther(body) {
    this.send(body, 303);
  }
  notModified(body) {
    this.send(body, 304);
  }
  useProxy(body) {
    this.send(body, 305);
  }
  switchProxy(body) {
    this.send(body, 306);
  }
  temporaryRedirect(body) {
    this.send(body, 307);
  }
  permanentRedirect(body) {
    this.send(body, 308);
  }
  badRequest(body) {
    this.send(body, 400);
  }
  unauthorized(body) {
    this.send(body, 401);
  }
  paymentRequired(body) {
    this.send(body, 402);
  }
  forbidden(body) {
    this.send(body, 403);
  }
  notFound(body) {
    this.send(body, 404);
  }
  methodNotAllowed(body) {
    this.send(body, 405);
  }
  notAcceptable(body) {
    this.send(body, 406);
  }
  proxyAuthenticationRequired(body) {
    this.send(body, 407);
  }
  requestTimeout(body) {
    this.send(body, 408);
  }
  conflict(body) {
    this.send(body, 409);
  }
  gone(body) {
    this.send(body, 410);
  }
  lengthRequired(body) {
    this.send(body, 411);
  }
  preconditionFailed(body) {
    this.send(body, 412);
  }
  payloadTooLarge(body) {
    this.send(body, 413);
  }
  uriTooLong(body) {
    this.send(body, 414);
  }
  unsupportedMediaType(body) {
    this.send(body, 415);
  }
  rangeNotSatisfiable(body) {
    this.send(body, 416);
  }
  expectationFailed(body) {
    this.send(body, 417);
  }
  imATeapot(body) {
    this.send(body, 418);
  }
  misdirectedRequest(body) {
    this.send(body, 421);
  }
  unprocessableEntity(body) {
    this.send(body, 422);
  }
  locked(body) {
    this.send(body, 423);
  }
  failedDependency(body) {
    this.send(body, 424);
  }
  tooEarly(body) {
    this.send(body, 425);
  }
  upgradeRequired(body) {
    this.send(body, 426);
  }
  preconditionRequired(body) {
    this.send(body, 428);
  }
  tooManyRequests(body) {
    this.send(body, 429);
  }
  requestHeaderFieldsTooLarge(body) {
    this.send(body, 431);
  }
  unavailableForLegalReasons(body) {
    this.send(body, 451);
  }
  internalServerError(body) {
    this.send(body, 500);
  }
  notImplemented(body) {
    this.send(body, 501);
  }
  badGateway(body) {
    this.send(body, 502);
  }
  serviceUnavailable(body) {
    this.send(body, 503);
  }
  gatewayTimeout(body) {
    this.send(body, 504);
  }
  httpVersionNotSupported(body) {
    this.send(body, 505);
  }
  variantAlsoNegotiates(body) {
    this.send(body, 506);
  }
  insufficientStorage(body) {
    this.send(body, 507);
  }
  loopDetected(body) {
    this.send(body, 508);
  }
  notExtended(body) {
    this.send(body, 510);
  }
  networkAuthenticationRequired(body) {
    this.send(body, 511);
  }
  /**
   * @description Returns if the response has been sent to the client - only one response can be sent, if you return something in a middleware, all the chain of middlewares and the controller will be stopped
   */
  hasBeenSent() {
    return this.hasSent;
  }
  parseResponse(body, statusCode) {
    if (Buffer.isBuffer(body)) {
      return body;
    }
    return JSON.stringify({
      statusCode,
      body
    });
  }
};

// src/Utils.ts
function validatePath(str) {
  if (!str.startsWith("/")) {
    str = `/${str}`;
  }
  if (!str.endsWith("/")) {
    str = `${str}/`;
  }
  return str.replace(/\/+/g, "/");
}
function checkDuplicateTopic(topic, inputRoutes) {
  const routes = Object.keys(inputRoutes);
  if (routes.includes(topic)) {
    logError(new Error("Duplicate route"), `Route ${topic} already exists`);
    process.exit(1);
  }
  return;
}

// src/Server/Server.ts
var Server = class {
  constructor(options) {
    __publicField(this, "port");
    __publicField(this, "host");
    __publicField(this, "username");
    __publicField(this, "password");
    __publicField(this, "reconnectionRetries");
    __publicField(this, "mqttClient");
    __publicField(this, "url");
    __publicField(this, "routes", {});
    __publicField(this, "logs");
    this.port = options.port;
    this.host = options.host;
    this.username = options.username;
    this.password = options.password;
    this.logs = options.logs ?? false;
    this.reconnectionRetries = options.reconnectionRetries ?? 3;
    this.url = `mqtt://${this.host}:${this.port}`;
  }
  async connect() {
    return new Promise((resolve, reject) => {
      try {
        this.mqttClient = mqtt.connect(this.url, {
          username: this.username,
          password: this.password
        });
        this.setBaseEvents();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  disconnect() {
    this.mqttClient.end();
  }
  get(path, controller, middlewares) {
    this.checkConnection();
    path = validatePath(path);
    checkDuplicateTopic(`SERVER/${"GET" /* GET */}${path}`, this.routes);
    this.assignRoutes(
      `SERVER/${"GET" /* GET */}${path}`,
      controller,
      middlewares
    );
  }
  post(path, controller, middlewares) {
    this.checkConnection();
    path = validatePath(path);
    checkDuplicateTopic(`SERVER/${"POST" /* POST */}${path}`, this.routes);
    this.assignRoutes(
      `SERVER/${"POST" /* POST */}${path}`,
      controller,
      middlewares
    );
  }
  put(path, controller, middlewares) {
    this.checkConnection();
    path = validatePath(path);
    checkDuplicateTopic(`SERVER/${"PUT" /* PUT */}${path}`, this.routes);
    this.assignRoutes(
      `SERVER/${"PUT" /* PUT */}${path}`,
      controller,
      middlewares
    );
  }
  patch(path, controller, middlewares) {
    this.checkConnection();
    path = validatePath(path);
    checkDuplicateTopic(`SERVER/${"PATCH" /* PATCH */}${path}`, this.routes);
    this.assignRoutes(
      `SERVER/${"PATCH" /* PATCH */}${path}`,
      controller,
      middlewares
    );
  }
  delete(path, controller, middlewares) {
    this.checkConnection();
    path = validatePath(path);
    checkDuplicateTopic(`SERVER/${"DELETE" /* DELETE */}${path}`, this.routes);
    this.assignRoutes(
      `SERVER/${"DELETE" /* DELETE */}${path}`,
      controller,
      middlewares
    );
  }
  applyRouter(router) {
    Object.keys(router.routes).forEach((key) => {
      checkDuplicateTopic(key, this.routes);
      Object.assign(this.routes, {
        [key]: router.routes[key]
      });
      this.setTopicListener(
        key,
        router.routes[key].controller,
        router.routes[key].middlewares ?? []
      );
    });
  }
  assignRoutes(topic, controller, middlewares) {
    Object.assign(this.routes, {
      [topic]: {
        controller,
        middlewares
      }
    });
    this.setTopicListener(topic, controller, middlewares);
  }
  setTopicListener(topic, controller, middlewares) {
    this.mqttClient.subscribe(topic, { qos: 0 }, (error) => {
      if (error) {
        logError(error, `Error setting route ${topic}`);
      } else {
        if (this.logs) {
          log(`Listening for route ${topic}`, true);
        }
      }
    });
    this.mqttClient.on("message", async (receivedTopic, message) => {
      if (receivedTopic !== topic) {
        return;
      }
      const request = new Request(
        receivedTopic,
        Buffer.from(message).toString()
      );
      const response = new Response(this.mqttClient, receivedTopic, this.logs);
      if (middlewares) {
        for (const middleware of middlewares) {
          await middleware(request, response);
          if (response.hasBeenSent()) {
            return;
          }
        }
      }
      return await controller(request, response);
    });
  }
  setBaseEvents() {
    this.mqttClient.on("connect", () => {
      log(`Connected to ${this.url}`, true);
    });
    this.mqttClient.on("error", (error) => {
      logError(error, `Error connecting to ${this.url}`);
    });
    this.mqttClient.on("reconnect", () => {
      if (this.reconnectionRetries === 0) {
        logError(
          new Error("Max retries reached"),
          `Error connecting to ${this.url}`
        );
        process.exit(1);
      }
      this.reconnectionRetries -= 1;
      log(`Trying to reconnect to ${this.url} on port ${this.port}`, true);
    });
    this.mqttClient.on("disconnect", () => {
      log(`Disconnected from ${this.url} on port ${this.port}`, true);
    });
    this.mqttClient.on("close", () => {
      log(`Closed connection to ${this.url} on port ${this.port}`, true);
    });
    this.mqttClient.on("offline", () => {
      log(`Offline connection to ${this.url} on port ${this.port}`, true);
    });
    this.mqttClient.on("end", () => {
      log(`End connection to ${this.url} on port ${this.port}`, true);
    });
  }
  checkConnection() {
    if (!this.mqttClient) {
      logError(
        new Error(
          "Not connected to any MQTT broker, did you forget to call .connect()?"
        )
      );
      process.exit(1);
    }
  }
};

// src/Server/Router/Router.ts
var Router = class _Router {
  constructor(prefix) {
    __publicField(this, "internalPrefix");
    __publicField(this, "routes", {});
    this.internalPrefix = prefix ? validatePath(prefix) : void 0;
  }
  group(cb, prefix) {
    const router = new _Router(prefix);
    cb(router);
    this.applyRoutes(router);
    return this;
  }
  get(path, controller, middlewares) {
    if (this.internalPrefix) {
      path = validatePath(`${this.internalPrefix}${path}`);
    }
    checkDuplicateTopic(`SERVER/${"GET" /* GET */}${path}`, this.routes);
    Object.assign(this.routes, {
      [`SERVER/${"GET" /* GET */}${path}`]: {
        controller,
        middlewares
      }
    });
  }
  post(path, controller, middlewares) {
    if (this.internalPrefix) {
      path = validatePath(`${this.internalPrefix}${path}`);
    }
    console.log(path);
    checkDuplicateTopic(`SERVER/${"POST" /* POST */}${path}`, this.routes);
    Object.assign(this.routes, {
      [`SERVER/${"POST" /* POST */}${path}`]: {
        controller,
        middlewares
      }
    });
  }
  put(path, controller, middlewares) {
    if (this.internalPrefix) {
      path = validatePath(`${this.internalPrefix}${path}`);
    }
    checkDuplicateTopic(`SERVER/${"PUT" /* PUT */}${path}`, this.routes);
    Object.assign(this.routes, {
      [`SERVER/${"PUT" /* PUT */}${path}`]: {
        controller,
        middlewares
      }
    });
  }
  patch(path, controller, middlewares) {
    if (this.internalPrefix) {
      path = validatePath(`${this.internalPrefix}${path}`);
    }
    checkDuplicateTopic(`SERVER/${"PATCH" /* PATCH */}${path}`, this.routes);
    Object.assign(this.routes, {
      [`SERVER/${"PATCH" /* PATCH */}${path}`]: {
        controller,
        middlewares
      }
    });
  }
  delete(path, controller, middlewares) {
    if (this.internalPrefix) {
      path = validatePath(`${this.internalPrefix}${path}`);
    }
    checkDuplicateTopic(`SERVER/${"DELETE" /* DELETE */}${path}`, this.routes);
    Object.assign(this.routes, {
      [`SERVER/${"DELETE" /* DELETE */}${path}`]: {
        controller,
        middlewares
      }
    });
  }
  applyRoutes(router) {
    Object.keys(router.routes).forEach((key) => {
      checkDuplicateTopic(key, this.routes);
      Object.assign(this.routes, {
        [key]: router.routes[key]
      });
    });
  }
};
var Router_default = new Router();

// src/Client/Client.ts
import mqtt2 from "mqtt";

// src/Client/ClientResponse.ts
var ClientResponse = class {
  constructor(topic, body) {
    __publicField(this, "topic");
    __publicField(this, "data");
    this.topic = topic;
    this.data = body;
  }
};

// src/Client/Client.ts
var FlynestClient = class {
  /**
   * @Description Creates a new FlynestClient - for the broker you can use either broker host or broker url, mqttClient takes precedence, then broker url and finally broker host
   * @param options {FlynestClientOptions}
   */
  constructor(options) {
    __publicField(this, "mqttClient");
    __publicField(this, "brokerHost");
    __publicField(this, "port");
    __publicField(this, "brokerUrl");
    __publicField(this, "username");
    __publicField(this, "password");
    __publicField(this, "logs");
    if (!options.brokerHost && !options.brokerUrl && !options.mqttClient) {
      throw new Error("Broker host, mqtt client or broker url is required");
    }
    if (options.brokerHost && !options.port) {
      throw new Error("Port is required when using broker host");
    }
    this.brokerHost = options.brokerHost;
    this.port = options.port;
    this.brokerUrl = options.brokerUrl;
    this.username = options.username;
    this.password = options.password;
    this.logs = options.logs ?? false;
    if (!options.mqttClient) {
      this.mqttClient = mqtt2.connect(
        this.brokerUrl || `mqtt://${this.brokerHost}:${this.port}`,
        {
          username: this.username,
          password: this.password
        }
      );
      if (!this.mqttClient) {
        throw new Error("Failed to connect to MQTT broker");
      }
      log(
        `Connected to ${this.brokerUrl || `mqtt://${this.brokerHost}:${this.port}`}`,
        this.logs
      );
      return;
    }
    this.mqttClient = options.mqttClient;
  }
  /**
   * @Description Sends a request to the broker - for query params use the params object do not use qs inside the path
   * @param method {GET, POST, PUT, PATCH, DELETE} - http method
   * @param path {string} - path
   * @param body {BodyType} - request body
   * @param headers {HeaderType} - headers
   * @param queryParams {object} - query params
   */
  async request(method, path, {
    body,
    headers,
    queryParams
  }) {
    path = validatePath(path);
    const requestTopic = `SERVER/${method}${path}`;
    let requestBody = {};
    if (headers) {
      requestBody = { ...requestBody, ...headers };
    }
    if (queryParams) {
      requestBody = { ...requestBody, ...queryParams };
    }
    if (body) {
      requestBody = { ...requestBody, ...body };
    }
    this.mqttClient.publish(requestTopic, JSON.stringify(requestBody));
    this.mqttClient.subscribe(requestTopic.replace("SERVER", "CLIENT"));
    return this.awaitRequest(requestTopic);
  }
  async get(path, {
    headers,
    queryParams
  }) {
    path = validatePath(path);
    const requestTopic = `SERVER/${"GET" /* GET */}${path}`;
    let requestBody = {};
    if (headers) {
      requestBody = { ...requestBody, ...headers };
    }
    if (queryParams) {
      requestBody = { ...requestBody, ...queryParams };
    }
    this.mqttClient.publish(requestTopic, JSON.stringify(requestBody));
    this.mqttClient.subscribe(requestTopic.replace("SERVER", "CLIENT"));
    return this.awaitRequest(requestTopic);
  }
  async post(path, {
    headers,
    body,
    queryParams
  }) {
    path = validatePath(path);
    const requestTopic = `SERVER/${"POST" /* POST */}${path}`;
    let requestBody = {};
    if (headers) {
      requestBody = { ...requestBody, ...headers };
    }
    if (queryParams) {
      requestBody = { ...requestBody, ...queryParams };
    }
    if (body) {
      requestBody = { ...requestBody, ...body };
    }
    this.mqttClient.publish(requestTopic, JSON.stringify(requestBody));
    this.mqttClient.subscribe(requestTopic.replace("SERVER", "CLIENT"));
    return this.awaitRequest(requestTopic);
  }
  async patch(path, {
    headers,
    body,
    queryParams
  }) {
    path = validatePath(path);
    const requestTopic = `SERVER/${"PATCH" /* PATCH */}${path}`;
    let requestBody = {};
    if (headers) {
      requestBody = { ...requestBody, ...headers };
    }
    if (queryParams) {
      requestBody = { ...requestBody, ...queryParams };
    }
    if (body) {
      requestBody = { ...requestBody, ...body };
    }
    this.mqttClient.publish(requestTopic, JSON.stringify(requestBody));
    this.mqttClient.subscribe(requestTopic.replace("SERVER", "CLIENT"));
    return this.awaitRequest(requestTopic);
  }
  async put(path, {
    headers,
    body,
    queryParams
  }) {
    path = validatePath(path);
    const requestTopic = `SERVER/${"PUT" /* PUT */}${path}`;
    let requestBody = {};
    if (headers) {
      requestBody = { ...requestBody, ...headers };
    }
    if (queryParams) {
      requestBody = { ...requestBody, ...queryParams };
    }
    if (body) {
      requestBody = { ...requestBody, ...body };
    }
    this.mqttClient.publish(requestTopic, JSON.stringify(requestBody));
    this.mqttClient.subscribe(requestTopic.replace("SERVER", "CLIENT"));
    return this.awaitRequest(requestTopic);
  }
  async delete(path, {
    headers,
    queryParams
  }) {
    path = validatePath(path);
    const requestTopic = `SERVER/${"DELETE" /* DELETE */}${path}`;
    let requestBody = {};
    if (headers) {
      requestBody = { ...requestBody, ...headers };
    }
    if (queryParams) {
      requestBody = { ...requestBody, ...queryParams };
    }
    this.mqttClient.publish(requestTopic, JSON.stringify(requestBody));
    this.mqttClient.subscribe(requestTopic.replace("SERVER", "CLIENT"));
    return this.awaitRequest(requestTopic);
  }
  async awaitRequest(requestTopic) {
    return new Promise((resolve, reject) => {
      this.mqttClient.on("message", (topic, message) => {
        if (requestTopic.replace("SERVER", "CLIENT") === topic) {
          let parsedMessage = Buffer.from(message).toString();
          if (JSON.parse(parsedMessage)) {
            parsedMessage = JSON.parse(parsedMessage);
          }
          resolve(new ClientResponse(topic, parsedMessage));
        }
      });
      this.mqttClient.on("error", (error) => {
        reject(error);
      });
    });
  }
};
var Client_default = FlynestClient;

// src/index.ts
var server = new Server({
  host: "localhost",
  port: 1883,
  logs: true
});
(async () => {
  await server.connect();
  server.get("/users", async (request, response) => {
    console.log("ok");
    return response.ok({ message: "Hello World" });
  });
  Router_default.get("/", async (request, response) => {
    return response.ok({ message: "Hello World" });
  }, [async (request, response) => {
    console.log("Middleware");
  }]);
  const client = new Client_default({
    brokerUrl: "mqtt://localhost:1883"
  });
  server.applyRouter(Router_default);
  setInterval(async () => {
    const res = await client.get("/", {
      headers: {
        authorization: "Bearer 123"
      },
      queryParams: {
        id: "123"
      }
    }).catch((error) => {
      console.log(error);
    });
    console.log(res);
  }, 2e3);
})();
//# sourceMappingURL=index.mjs.map