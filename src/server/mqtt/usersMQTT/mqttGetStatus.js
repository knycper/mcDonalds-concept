import WebSocket from "ws";
import client from "./mqttClientUser.js";
import User from '../../models/User.js';

// Tworzymy serwer WebSocket na porcie 8081
const wss = new WebSocket.Server({ port: 8081 });

// Globalna mapa przechowująca połączenia WebSocket
const activeClients = new Map();

// Subskrybujemy tematy MQTT
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

// Nasłuchujemy wiadomości z tematu MQTT
client.on("message", async (topic, message) => {
    try {
        const mess = JSON.parse(message);
        const { email } = mess;

        // Sprawdzamy, czy użytkownik istnieje w bazie
        const user = await User.findOne({ email });

        if (!user) {
            console.log("Użytkownik nie znaleziony", email);
            return;
        }

        // Wysłanie odpowiedzi na WebSocket do odpowiedniego użytkownika
        if (topic === "orderStatus" || topic === "orderStatus/update") {
            // Wysyłamy dane do WebSocket, jeżeli adres email się zgadza
            activeClients.forEach((client, ws) => {
                if (client.email === email) {
                    const statusMessage = { type: topic, status: user.orderStatus };
                    ws.send(JSON.stringify(statusMessage));
                }
            });
        }

    } catch (error) {
        console.error("Błąd obsługi wiadomości MQTT:", error);
    }
});

// Nasłuchujemy połączeń WebSocket
wss.on("connection", (ws) => {
    console.log("Połączono z klientem WebSocket");

    // Obsługuje wiadomości od klienta
    ws.on("message", (message) => {
        const { email } = JSON.parse(message);
        ws.email = email; // Przypisujemy email do połączenia WebSocket

        console.log("Otrzymano email z WebSocket:", email);

        // Przechowujemy połączenie w mapie
        activeClients.set(ws, { email });

        // Możemy teraz wysłać zapytanie MQTT dla tego emaila (np. pobranie statusu zamówienia)
        client.publish("orderStatus", JSON.stringify({ email }));
    });

    // Zamknięcie połączenia WebSocket
    ws.on("close", () => {
        console.log("Połączenie WebSocket zamknięte");
        activeClients.delete(ws);  // Usuwamy połączenie z aktywnych klientów
    });
});

console.log("WebSocket server nasłuchuje na porcie 8081");
