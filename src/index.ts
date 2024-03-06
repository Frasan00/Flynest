import Server from "./Server/Server";
import Router from "./Server/Router/Router";
import FlynestClient from "./Client/Client";
import Request from "./Server/Request/Request";
import Response from "./Server/Response/Response";

export { Server, Router, FlynestClient, Request, Response };

const server = new Server({
  host: "localhost",
  port: 1883,
  logs: true,
});

(async () => {
  await server.connect();

  server.get("/users", async (request, response) => {
    console.log("ok");
    return response.ok({ message: "Hello World" });
  });

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

  const client = new FlynestClient({
    brokerUrl: "mqtt://localhost:1883",
  });

  server.applyRouter(Router);

  setInterval(async () => {
    const res = await client
      .post("/api/nested", {
        headers: {
          authorization: "Bearer 123",
        },
        buffer: Buffer.from("Buffered data"),
        queryParams: {
          id: "123",
        },
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(res);
  }, 2000);
})();
