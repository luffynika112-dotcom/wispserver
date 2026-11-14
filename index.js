import http from "node:http";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const port = parseInt(process.env.PORT || "10000", 10);

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Wisp server is running\n");
});

server.on("upgrade", (req, socket, head) => {
  wisp.routeRequest(req, socket, head);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Wisp server listening on port ${port}`);
});
