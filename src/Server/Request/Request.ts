import { BodyType, HeaderType, RequestBody } from "./RequestTypes";

export default class Request {
  public qs?: Record<string, string>;
  public headers?: HeaderType;
  public body?: BodyType;
  public url?: string;
  public method?: string;
  public buffer?: Buffer;
  public ctx?: Record<string, any>;

  public constructor(topic: string, message: string | Buffer) {
    let requestBody: RequestBody | null = null;
    if (Buffer.isBuffer(message)) {
      this.buffer = message;
    } else {
      this.url = topic;
      requestBody = JSON.parse(message) as RequestBody;
    }

    if (requestBody) {
      this.qs = requestBody.qs;
      this.headers = requestBody.headers;
      this.body = requestBody.body;
      this.method = topic.split("/")[1];
    }
  }
}
