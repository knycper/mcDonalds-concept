'use client'

import React, { useEffect, useState } from "react";

export default function OrderStatus() {
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string>("");
    const [email, setEmail] = useState<string | null>(null);
    const [isEmailLoaded, setIsEmailLoaded] = useState(false); // Dodany stan

    useEffect(() => {
        const local = localStorage.getItem("activeUser");

        if (local) {
            const user = JSON.parse(local);
            setEmail(user.email);
            setIsEmailLoaded(true); // Email załadowany, możemy połączyć WebSocket
        }
    }, []);

    useEffect(() => {
        if (!isEmailLoaded || !email) {
            return; // Czekamy, aż email będzie załadowany
        }

        const connectWebSocket = () => {
            const websocket = new WebSocket("ws://localhost:8081");

            websocket.onopen = () => {
                console.log("Połączono z serwerem WebSocket");
                console.log(email, "email w orderstatus");

                // Upewniamy się, że email jest dostępny przed wysyłaniem
                if (email) {
                    websocket.send(JSON.stringify({ email }));
                } else {
                    console.error("Brak adresu email użytkownika");
                }
            };

            websocket.onmessage = (event) => {
                const message = JSON.parse(event.data);

                if (message.type === "orderStatus") {
                    if (message.error) {
                        setError(message.error);
                    } else {
                        setStatus(message.status);
                    }
                }

                if (message.type === "orderStatus/update") {
                    setStatus(message.status);
                }
            };

            websocket.onerror = (error) => {
                console.error("Błąd WebSocket:", error);
                setError("Błąd połączenia z serwerem");
                // Ponawiamy próbę połączenia po kilku sekundach
                setTimeout(connectWebSocket, 5000);
            };

            websocket.onclose = () => {
                console.log("Połączenie WebSocket zamknięte");
                setError("Połączenie WebSocket zostało zamknięte");
            };

            return websocket;
        };

        // Próba połączenia
        const websocket = connectWebSocket();

        return () => {
            if (websocket) {
                websocket.close();
            }
        };
    }, [isEmailLoaded, email]); // Zmienna email oraz isEmailLoaded

    if (status === null) {
        return (<div>Loading...</div>);
    }

    return (
        <div>
            <h1>Stan zamówienia:</h1>
            {error && <p style={{ color: "red" }}>Błąd: {error}</p>}
            <p>{status}</p>
        </div>
    );
};
