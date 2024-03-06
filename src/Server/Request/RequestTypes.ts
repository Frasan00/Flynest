export type BodyType = Record<string, any>;

export type RequestBody = {
  qs?: Record<string, string>;
  headers?: HeaderType;
  body?: BodyType;
  buffer: {
    type: string;
    data: Buffer;
  };
};

export type HeaderType = {
  // TO DO
  authorization?: string;
  "content-type"?: string;
  "content-length"?: number;
  "user-agent"?: string;
  "cache-control"?: string;
};
