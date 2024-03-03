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

  const client = new FlynestClient({
    brokerUrl: "mqtt://localhost:1883",
  });

  setInterval(async () => {
    const res = await client.request("GET", "/users", {
      headers: {
        authorization: "Bearer 123",
      },
      body: {
        name: "John",
      },
      queryParams: {
        id: "123",
      }
    }).catch((error) => {
      console.log(error);
    });

    console.log(res);
  }, 2000)

  server.applyRouter(Router);
})();
