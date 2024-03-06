import Server from "./Server/Server";
import Router from "./Server/Router/Router";
import FlynestClient from "./Client/Client";

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

  Router.post(
    "/",
    async (request, response) => {
      return response.ok({ message: "Hello World" });
    },
    [
      async (request, response) => {
        console.log("Middleware");
      },
    ],
  );

  const client = new FlynestClient({
    brokerUrl: "mqtt://localhost:1883",
  });

  server.applyRouter(Router);

  setInterval(async () => {
    const res = await client
      .post("/", {
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
