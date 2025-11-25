let ws;
let reconnectInterval = 3000; // 3 seconds

function connect() {
  ws = new WebSocket("ws://localhost:3000");

  ws.onopen = () => {
    console.log("✅ Connected to WebSocket");
    // start sending message periodically
    setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "send",
            channel: "machine3",
          })
        );
      }
    }, 5000);
  };

  ws.onmessage = (event) => {
    console.log("📨 Message:", event.data);
  };

  ws.onclose = () => {
    console.log(
      "❌ Connection closed, retrying in 3s..."
    );
    setTimeout(connect, reconnectInterval);
  };

  ws.onerror = (err) => {
    console.log(
      "❌ Connection closed, retrying in 3s..."
    );
    setTimeout(connect, reconnectInterval);
  };
}

// start first connection
connect();
