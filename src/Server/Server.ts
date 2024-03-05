import mqtt, { MqttClient } from "mqtt";
import { log, logError } from "../../Logger";
import Request from "./Request/Request";
import Response from "./Response/Response";
import {
  ApiRouteType,
  ControllerType,
  HttpMethodType,
  MiddlewareType,
  ServerOptions,
} from "./ServerTypes";
import { Router } from "./Router/Router";
import { checkDuplicateTopic, validatePath } from "../Utils";
import { rejects } from "node:assert";

export default class Server {
  public readonly port: number;
  public readonly host: string;
  protected readonly username?: string;
  protected readonly password?: string;
  public reconnectionRetries: number;

  protected mqttClient!: MqttClient;
  protected url: string;
  protected routes: ApiRouteType = {};
  protected logs: boolean;

  constructor(options: ServerOptions) {
    this.port = options.port;
    this.host = options.host;
    this.username = options.username;
    this.password = options.password;
    this.logs = options.logs ?? false;
    this.reconnectionRetries = options.reconnectionRetries ?? 3;
    this.url = `mqtt://${this.host}:${this.port}`;
  }

  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.mqttClient = mqtt.connect(this.url, {
          username: this.username,
          password: this.password,
        });

        this.setBaseEvents();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  public disconnect(): void {
    this.mqttClient.end();
  }

  public get(
    path: string,
    controller: ControllerType,
    middlewares?: MiddlewareType[],
  ): void {
    this.checkConnection();

    path = validatePath(path);
    checkDuplicateTopic(`SERVER/${HttpMethodType.GET}${path}`, this.routes);
    this.assignRoutes(
      `SERVER/${HttpMethodType.GET}${path}`,
      controller,
      middlewares,
    );
  }

  public post(
    path: string,
    controller: ControllerType,
    middlewares?: MiddlewareType[],
  ): void {
    this.checkConnection();

    path = validatePath(path);
    checkDuplicateTopic(`SERVER/${HttpMethodType.POST}${path}`, this.routes);
    this.assignRoutes(
      `SERVER/${HttpMethodType.POST}${path}`,
      controller,
      middlewares,
    );
  }

  public put(
    path: string,
    controller: ControllerType,
    middlewares?: MiddlewareType[],
  ): void {
    this.checkConnection();

    path = validatePath(path);
    checkDuplicateTopic(`SERVER/${HttpMethodType.PUT}${path}`, this.routes);
    this.assignRoutes(
      `SERVER/${HttpMethodType.PUT}${path}`,
      controller,
      middlewares,
    );
  }

  public patch(
    path: string,
    controller: ControllerType,
    middlewares?: MiddlewareType[],
  ): void {
    this.checkConnection();

    path = validatePath(path);
    checkDuplicateTopic(`SERVER/${HttpMethodType.PATCH}${path}`, this.routes);
    this.assignRoutes(
      `SERVER/${HttpMethodType.PATCH}${path}`,
      controller,
      middlewares,
    );
  }

  public delete(
    path: string,
    controller: ControllerType,
    middlewares?: MiddlewareType[],
  ): void {
    this.checkConnection();

    path = validatePath(path);
    checkDuplicateTopic(`SERVER/${HttpMethodType.DELETE}${path}`, this.routes);
    this.assignRoutes(
      `SERVER/${HttpMethodType.DELETE}${path}`,
      controller,
      middlewares,
    );
  }

  public applyRouter(router: Router) {
    Object.keys(router.routes).forEach((key) => {
      checkDuplicateTopic(key, this.routes);
      Object.assign(this.routes, {
        [key]: router.routes[key as keyof ApiRouteType],
      });

      this.setTopicListener(
        key,
        router.routes[key as keyof ApiRouteType].controller,
        router.routes[key as keyof ApiRouteType].middlewares ?? [],
      );
    });
  }

  private assignRoutes(
    topic: `SERVER/${HttpMethodType}${string}`,
    controller: ControllerType,
    middlewares?: MiddlewareType[],
  ): void {
    Object.assign(this.routes, {
      [topic]: {
        controller,
        middlewares,
      },
    });

    this.setTopicListener(topic, controller, middlewares);
  }

  private setTopicListener(
    topic: string,
    controller: ControllerType,
    middlewares?: MiddlewareType[],
  ): void {
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
        Buffer.from(message).toString(),
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

  private setBaseEvents(): void {
    this.mqttClient.on("connect", () => {
      log(`Connected to ${this.url}`, true);
    });

    this.mqttClient.on("error", (error: Error) => {
      logError(error, `Error connecting to ${this.url}`);
    });

    this.mqttClient.on("reconnect", () => {
      if (this.reconnectionRetries === 0) {
        logError(
          new Error("Max retries reached"),
          `Error connecting to ${this.url}`,
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

  private checkConnection(): void {
    if (!this.mqttClient) {
      logError(
        new Error(
          "Not connected to any MQTT broker, did you forget to call .connect()?",
        ),
      );

      process.exit(1);
    }
  }
}
