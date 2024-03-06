# Flynest - A Modern MQTT Server with HTTP-like Features

- Flynest it's a modern platform that offers HTTP-like features and feel.
- With Flynest, you can serve clients in a familiar HTTP way while having the efficiency and versatility of the MQTT protocol.

## Installation

You can install Flynest via npm:
```bash
npm install flynest
```

or yarn:
```bash
yarn add flynest
```

## Features
1) HTTP-like Interface: Flynest provides an intuitive interface that resembles HTTP, making it easy to adopt and integrate into existing systems.
2) Efficient MQTT Protocol: Underneath its HTTP-like facade, Flynest leverages MQTT for efficient and reliable communication between clients.

## Usage

### Server Initialization
```typescript
import { Server } from 'flynest';

const server = new Server({
    host: "localhost",
    port: 1883,
    logs: true,
});
```

### Routing
- Routing can be made with the Router object
- Allows you to define common prefix routes

```typescript
import { Router } from 'flynest';

// Takes a path, a controller and an optional list of middlewares
Router.post(
    "/",
    async (request, response) => {
        return response.ok({ message: "Hello World" });
    },
    [
        async (request: any, response: Response) => {
            console.log("Middleware");
        },
    ],
);

// You can define more complex and nested routes like this:
Router.group(
    (router) => {
        router.post("/", async (request, response) => {
            return response.ok({ message: "Hello World" });
        });

        router.get("/", async (request, response) => {
            return response.ok({ message: "Hello World" });
        });

        router.group(
            (router) => {
                router.post("/", async (request, response) => {
                    return response.ok({ message: "Hello World" });
                });
            },
            {
                prefix: "/nested",
                middlewares: [
                    async (request, response) => {
                        console.log("nested middleware");
                    },
                ],
            },
        );
    },
    {
        prefix: "/api/",
        middlewares: [async (req, res) => console.log("Middleware route")],
    },
);

// To apply your routes to the server use
server.applyRouter(Router)
```

### Client
```typescript
import { FlynestClient } from 'flynest-client';

// You can also use an mqttVlient object or a pair of host and port.
const client = new FlynestClient({
    brokerUrl: "mqtt://localhost:1883",
});

const res = await client.post("/", {
        headers: {
          authorization: "Bearer 123",
        },
        buffer: Buffer.from("Buffered data"),
        body: {
            name: "John"
        },
        queryParams: {
          id: "123",
        },
      })
      .catch((error: Error) => {
        throw new Error(error);
      });
```