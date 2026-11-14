import http from "node:http";
import net from "node:net";
import { WebSocketServer } from "ws";

const port = parseInt(process.env.PORT || "10000", 10);

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Wisp server is active\n");
});

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws, req) => {
  let targetSocket = null;

  ws.on("message", (message, isBinary) => {
    if (!isBinary) {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "connect" && data.hostname && data.port) {
          targetSocket = net.connect(data.port, data.hostname, () => {
            // Connection established
          });

          targetSocket.on("data", (chunk) => {
            if (ws.readyState === ws.OPEN) {
              ws.send(chunk);
            }
          });

          targetSocket.on("close", () => {
            if (ws.readyState === ws.OPEN) ws.close();
          });

          targetSocket.on("error", () => {
            if (ws.readyState === ws.OPEN) ws.close();
          });
        }
      } catch (e) {
        // Handle control frames if needed
      }
      return;
    }

    // Forward raw binary TCP payloads to the target Minecraft server
    if (targetSocket && targetSocket.writable) {
      targetSocket.write(message);
    }
  });

  ws.on("close", () => {
    if (targetSocket) targetSocket.destroy();
  });
});

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Functional Wisp tunneling server running on port ${port}`);
});
