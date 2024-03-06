import { BodyType, HeaderType, RequestBody } from "./RequestTypes";

export default class Request {
  public qs?: Record<string, string>;
  public headers?: HeaderType;
  public body?: BodyType;
  public url?: string;
  public method?: string;
  public buffer?: Buffer;
  public ctx?: Record<string, any>;

  public constructor(topic: string, message: string) {
    this.url = topic;
    let requestBody: RequestBody | null = null;
    if (message) {
      requestBody = JSON.parse(message);
    }

    if (requestBody) {
      this.qs = requestBody.qs;
      this.headers = requestBody.headers;
      this.body = requestBody.body;
      this.buffer = requestBody.buffer.data;
      this.method = topic.split("/")[1];
    }
  }
}
