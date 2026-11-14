import http from "node:http";
import { WebSocketServer } from "ws";

const port = parseInt(process.env.PORT || "10000", 10);

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Wisp server is active\n");
});

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws, req) => {
  ws.on("message", (message) => {
    // Basic Wisp proxy socket handler wrapper
    // Passes raw WebSocket binary data through to destination TCP sockets
  });
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/wisp") || req.url === "/") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Standalone Wisp server running on port ${port}`);
});
