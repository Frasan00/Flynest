export type BodyType = Record<any, any> | Buffer;


export type RequestBody = {
  qs?: Record<string, string>;
  headers?: HeaderType;
  body?: BodyType;
};

export type HeaderType = {
  // TO DO
  authorization?: string;
  "content-type"?: string;
  "content-length"?: number;
  "user-agent"?: string;
  "cache-control"?: string;
};
