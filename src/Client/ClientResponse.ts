export default class ClientResponse {
  protected topic: string;
  protected data: Object | Buffer;

  public constructor(topic: string, body: Object | Buffer) {
    this.topic = topic;
    this.data = body;
  }
}
