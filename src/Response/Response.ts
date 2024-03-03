import { MqttClient } from "mqtt";
import { StatusCode } from "./ResponseTypes";
import { log } from "../../Logger";

export default class Response {
  protected topic: string;
  protected mqttClient!: MqttClient;
  protected logs: boolean = false;

  public constructor(
    mqttClient: MqttClient,
    topic: string,
    logs: boolean = false,
  ) {
    // Base topic has SERVER/{METHOD}{path} for responses the server sends on CLIENT/{METHOD}{path}
    this.topic = `CLIENT/${topic.split("/").slice(1).join("/")}`;
    this.mqttClient = mqttClient;
    this.logs = logs;
  }

  private parseResponse(
    body: Record<string, any> | Buffer,
    statusCode: StatusCode,
  ): string | Buffer {
    if (Buffer.isBuffer(body)) {
      return body;
    }

    return JSON.stringify({
      statusCode,
      body,
    });
  }

  public send(body: Record<string, any>, code: StatusCode = 200): void {
    this.mqttClient.publish(this.topic, this.parseResponse(body, code));

    log(`Published: ${this.topic} -> ${body}`, this.logs);
  }

  public sendBuffer(buffer: Buffer, code: StatusCode = 200): void {
    this.mqttClient.publish(this.topic, buffer);
  }

  public continue(body: Record<string, any>): void {
    this.send(body, 100);
  }

  public switchingProtocols(body: Record<string, any>): void {
    this.send(body, 101);
  }

  public processing(body: Record<string, any>): void {
    this.send(body, 102);
  }

  public earlyHints(body: Record<string, any>): void {
    this.send(body, 103);
  }

  public ok(body: Record<string, any>): void {
    this.send(body, 200);
  }

  public created(body: Record<string, any>): void {
    this.send(body, 201);
  }

  public accepted(body: Record<string, any>): void {
    this.send(body, 202);
  }

  public nonAuthoritativeInformation(body: Record<string, any>): void {
    this.send(body, 203);
  }

  public noContent(body: Record<string, any>): void {
    this.send(body, 204);
  }

  public resetContent(body: Record<string, any>): void {
    this.send(body, 205);
  }

  public partialContent(body: Record<string, any>): void {
    this.send(body, 206);
  }

  public multiStatus(body: Record<string, any>): void {
    this.send(body, 207);
  }

  public alreadyReported(body: Record<string, any>): void {
    this.send(body, 208);
  }

  public imUsed(body: Record<string, any>): void {
    this.send(body, 226);
  }

  public multipleChoices(body: Record<string, any>): void {
    this.send(body, 300);
  }

  public movedPermanently(body: Record<string, any>): void {
    this.send(body, 301);
  }

  public found(body: Record<string, any>): void {
    this.send(body, 302);
  }

  public seeOther(body: Record<string, any>): void {
    this.send(body, 303);
  }

  public notModified(body: Record<string, any>): void {
    this.send(body, 304);
  }

  public useProxy(body: Record<string, any>): void {
    this.send(body, 305);
  }

  public switchProxy(body: Record<string, any>): void {
    this.send(body, 306);
  }

  public temporaryRedirect(body: Record<string, any>): void {
    this.send(body, 307);
  }

  public permanentRedirect(body: Record<string, any>): void {
    this.send(body, 308);
  }

  public badRequest(body: Record<string, any>): void {
    this.send(body, 400);
  }

  public unauthorized(body: Record<string, any>): void {
    this.send(body, 401);
  }

  public paymentRequired(body: Record<string, any>): void {
    this.send(body, 402);
  }

  public forbidden(body: Record<string, any>): void {
    this.send(body, 403);
  }

  public notFound(body: Record<string, any>): void {
    this.send(body, 404);
  }

  public methodNotAllowed(body: Record<string, any>): void {
    this.send(body, 405);
  }

  public notAcceptable(body: Record<string, any>): void {
    this.send(body, 406);
  }

  public proxyAuthenticationRequired(body: Record<string, any>): void {
    this.send(body, 407);
  }

  public requestTimeout(body: Record<string, any>): void {
    this.send(body, 408);
  }

  public conflict(body: Record<string, any>): void {
    this.send(body, 409);
  }

  public gone(body: Record<string, any>): void {
    this.send(body, 410);
  }

  public lengthRequired(body: Record<string, any>): void {
    this.send(body, 411);
  }

  public preconditionFailed(body: Record<string, any>): void {
    this.send(body, 412);
  }

  public payloadTooLarge(body: Record<string, any>): void {
    this.send(body, 413);
  }

  public uriTooLong(body: Record<string, any>): void {
    this.send(body, 414);
  }

  public unsupportedMediaType(body: Record<string, any>): void {
    this.send(body, 415);
  }

  public rangeNotSatisfiable(body: Record<string, any>): void {
    this.send(body, 416);
  }

  public expectationFailed(body: Record<string, any>): void {
    this.send(body, 417);
  }

  public imATeapot(body: Record<string, any>): void {
    this.send(body, 418);
  }

  public misdirectedRequest(body: Record<string, any>): void {
    this.send(body, 421);
  }

  public unprocessableEntity(body: Record<string, any>): void {
    this.send(body, 422);
  }

  public locked(body: Record<string, any>): void {
    this.send(body, 423);
  }

  public failedDependency(body: Record<string, any>): void {
    this.send(body, 424);
  }

  public tooEarly(body: Record<string, any>): void {
    this.send(body, 425);
  }

  public upgradeRequired(body: Record<string, any>): void {
    this.send(body, 426);
  }

  public preconditionRequired(body: Record<string, any>): void {
    this.send(body, 428);
  }

  public tooManyRequests(body: Record<string, any>): void {
    this.send(body, 429);
  }

  public requestHeaderFieldsTooLarge(body: Record<string, any>): void {
    this.send(body, 431);
  }

  public unavailableForLegalReasons(body: Record<string, any>): void {
    this.send(body, 451);
  }

  public internalServerError(body: Record<string, any>): void {
    this.send(body, 500);
  }

  public notImplemented(body: Record<string, any>): void {
    this.send(body, 501);
  }

  public badGateway(body: Record<string, any>): void {
    this.send(body, 502);
  }

  public serviceUnavailable(body: Record<string, any>): void {
    this.send(body, 503);
  }

  public gatewayTimeout(body: Record<string, any>): void {
    this.send(body, 504);
  }

  public httpVersionNotSupported(body: Record<string, any>): void {
    this.send(body, 505);
  }

  public variantAlsoNegotiates(body: Record<string, any>): void {
    this.send(body, 506);
  }

  public insufficientStorage(body: Record<string, any>): void {
    this.send(body, 507);
  }

  public loopDetected(body: Record<string, any>): void {
    this.send(body, 508);
  }

  public notExtended(body: Record<string, any>): void {
    this.send(body, 510);
  }

  public networkAuthenticationRequired(body: Record<string, any>): void {
    this.send(body, 511);
  }
}
