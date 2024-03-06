import { FlynestClientOptions, HttpMethod } from "./ClientTypes";
import mqtt, { MqttClient } from "mqtt";
import ClientResponse from "./ClientResponse";
import { BodyType, HeaderType } from "../Server/Request/RequestTypes";
import { validatePath } from "../Utils";
import { log } from "../../Logger";
import { HttpMethodType } from "../Server/ServerTypes";

class FlynestClient {
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
  public constructor(options: FlynestClientOptions) {
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
      this.mqttClient = mqtt.connect(
        this.brokerUrl || `mqtt://${this.brokerHost}:${this.port}`,
        {
          username: this.username,
          password: this.password,
        },
      );

      if (!this.mqttClient) {
        throw new Error("Failed to connect to MQTT broker");
      }

      log(
        `Connected to ${this.brokerUrl || `mqtt://${this.brokerHost}:${this.port}`}`,
        this.logs,
      );
      return;
    }

    this.mqttClient = options.mqttClient;
  }

  public async get(
    path: string,
    {
      headers,
      queryParams,
    }: {
      headers?: HeaderType;
      queryParams?: Record<string, string>;
    },
  ): Promise<ClientResponse> {
    path = validatePath(path);
    const requestTopic = `SERVER/${HttpMethodType.GET}${path}`;
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

  public async post(
    path: string,
    {
      headers,
      body,
      buffer,
      queryParams,
    }: {
      headers?: HeaderType;
      body?: BodyType;
      buffer?: Buffer;
      queryParams?: Record<string, string>;
    },
  ): Promise<ClientResponse> {
    path = validatePath(path);
    const requestTopic = `SERVER/${HttpMethodType.POST}${path}`;
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

    if (buffer) {
      requestBody = { ...requestBody, buffer: buffer };
    }

    this.mqttClient.publish(requestTopic, JSON.stringify(requestBody));
    this.mqttClient.subscribe(requestTopic.replace("SERVER", "CLIENT"));
    return this.awaitRequest(requestTopic);
  }

  public async patch(
    path: string,
    {
      headers,
      body,
      queryParams,
    }: {
      headers?: HeaderType;
      body?: BodyType;
      queryParams?: Record<string, string>;
    },
  ): Promise<ClientResponse> {
    path = validatePath(path);
    const requestTopic = `SERVER/${HttpMethodType.PATCH}${path}`;
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

  public async put(
    path: string,
    {
      headers,
      body,
      queryParams,
    }: {
      headers?: HeaderType;
      body?: BodyType;
      queryParams?: Record<string, string>;
    },
  ): Promise<ClientResponse> {
    path = validatePath(path);
    const requestTopic = `SERVER/${HttpMethodType.PUT}${path}`;
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

  public async delete(
    path: string,
    {
      headers,
      queryParams,
    }: {
      headers?: HeaderType;
      queryParams?: Record<string, string>;
    },
  ): Promise<ClientResponse> {
    path = validatePath(path);
    const requestTopic = `SERVER/${HttpMethodType.DELETE}${path}`;
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

  private async awaitRequest(requestTopic: string): Promise<ClientResponse> {
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

      this.mqttClient.on("error", (error: Error) => {
        reject(error);
      });
    });
  }
}

export default FlynestClient;
