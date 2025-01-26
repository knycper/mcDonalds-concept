import WebSocket from "ws";
import client from "./mqttClientStaff.js";
import axios from "axios";

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

    // Obsługa wiadomości MQTT
    client.on("message", (topic, message) => {
        if (topic === "orders/new") {
            const orderData = JSON.stringify({ type: "newOrder", order: JSON.parse(message) });

            // Wyślij wiadomość do wszystkich połączonych klientów
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(orderData);
                }
            });
        }
    });

    ws.on("message", (data) => {
        try {
            const message = JSON.parse(data);
            console.log(message.topic, "topic wiaodmosci w getOrder")

            if (message.topic === "time") {
                axios.post('http://localhost:3001/orders/timeUpdate', message)
                    .then(() => {
                        console.log("dostalem odpowiedz czyli porawnie zaktualizowano baze")
                    })
                    .catch(error => {
                        const message = error.response?.data?.message || "Błąd połączenia z serwerem";
                        console.log(message)
                    })

                client.publish(message.topic, data, (err) => {
                    if (err) {
                        console.log("Napotkano błąd: ", err)
                    }
                })
            }
        } catch (err) {
            console.error("Błąd podczas parsowania wiadomości od klienta WebSocket:", err);
        }
    });

    ws.on("close", () => {
        console.log("Połączenie WebSocket zamknięte");
    });
});

console.log("WebSocket server nasłuchuje na porcie 8080");