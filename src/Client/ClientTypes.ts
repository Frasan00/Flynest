import { MqttClient } from "mqtt";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type FlynestClientOptions = {
  mqttClient?: MqttClient;
  brokerHost?: string;
  port?: number;
  brokerUrl?: string;
  username?: string;
  password?: string;
  logs?: boolean;
};
