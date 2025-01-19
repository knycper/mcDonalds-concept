import WebSocket from "ws";
import client from "./mqttClientStaff.js";

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("Frontend połączony przez WebSocket");

    client.subscribe("orders/new", (err) => {
        if (err) {
            console.error("Błąd subskrypcji tematu MQTT:", err);
        } else {
            console.log("Subskrybowano temat: orders/new");
        }
    });

    client.on("message", (topic, message) => {
        if (topic === "orders/new") {
            ws.send(JSON.stringify({ type: "newOrder", order: JSON.parse(message) }));
        }
    });

    ws.on("close", () => {
        console.log("Połączenie WebSocket zamknięte");
    });
});

console.log("WebSocket server nasłuchuje na porcie 8080");