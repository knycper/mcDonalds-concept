import WebSocket from "ws";
import client from "./mqttClientUser.js";
import User from '../../models/User.js';
import connectDB from "../../database.js"

connectDB()

const wss = new WebSocket.Server({ port: 8081 });

const activeClients = new Map();

client.subscribe("orderStatus", (err) => {
    if (err) {
        console.error("Błąd subskrypcji tematu MQTT orderStatus:", err);
    } else {
        console.log("Subskrybowano temat: orderStatus");
    }
});

client.subscribe("orderStatus/update", (err) => {
    if (err) {
        console.error("Błąd subskrypcji tematu MQTT orderStatus/update: ", err);
    } else {
        console.log("Subskrybowano temat: orderStatus/update");
    }
});

client.subscribe("time", (err) => {
    if (err) {
        console.error("Błąd subskrypcji tematu MQTT time: ", err);
    } else {
        console.log("Subskrybowano temat: time");
    }
})

client.on("message", async (topic, message) => {
    try {
        const mess = JSON.parse(message);
        console.log("mess = ", mess)
        const { email } = mess;

        const user = await User.findOne({ email });

        if (!user) {
            console.log("Użytkownik nie znaleziony", email);
            return;
        }

        if (topic === "orderStatus") {
            console.log("topic to orderStatus", mess)
            const status = user.orderStatus
            activeClients.forEach((client, ws) => {
                if (client.email === email) {
                    const statusMessage = { type: topic, status: status };
                    console.log(statusMessage, "<- wiadomosc wysylana do ws ktora zawiera status i topic")
                    ws.send(JSON.stringify(statusMessage));
                }
            });
        } else if (topic === "orderStatus/update") {
            console.log("topic to orderStatus/update :", mess)
            const { status } = mess
            activeClients.forEach((client, ws) => {
                if (client.email === email) {
                    const statusMessage = { type: topic, status: status };
                    console.log(statusMessage, "<- wiadomosc wysylana do ws ktora zawiera status i topic")
                    ws.send(JSON.stringify(statusMessage));
                }
            });
        } else if (topic === "time") {
            activeClients.forEach((client, ws) => {
                console.log("jestem w petli")
                if (client.email === email) {
                    user.orderStatus.orderTime = orderTimeFromMessage
                    user.orderStatus.estimatedTime = estimatedTimeFromMessage
                    user.save()
                    const wsMessage = { type: topic, orderTime: message.orderTime, estimatedTime: message.estimatedTime }
                    console.log("to jest wiaodmosc wysylana do ws orderStatus: ", wsMessage)
                    ws.send(JSON.stringify(wsMessage));
                }
            });
        }

    } catch (error) {
        console.error("Błąd obsługi wiadomości MQTT:", error);
    }
});

wss.on("connection", (ws) => {
    console.log("Połączono z klientem WebSocket");

    ws.on("message", (message) => {
        const { email } = JSON.parse(message);
        ws.email = email;

        activeClients.set(ws, { email });

        client.publish("orderStatus", JSON.stringify({ email }));
    });

    ws.on("close", () => {
        console.log("Połączenie WebSocket zamknięte");
        activeClients.delete(ws);
    });
});

console.log("WebSocket server nasłuchuje na porcie 8081");
