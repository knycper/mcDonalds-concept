'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import ModalSucces from "./modals/ModalSucces";
import ModalError from "./modals/ModalError";

interface StatusProps {
    status: string | null;
    orderTime: string | null;
    estimatedTime: string | null;
}

export default function OrderStatus() {
    const [status, setStatus] = useState<StatusProps>({
        status: "None",
        orderTime: null,
        estimatedTime: null
    });
    const [error, setError] = useState<string>("");
    const [email, setEmail] = useState<string | null>(null);
    const [isEmailLoaded, setIsEmailLoaded] = useState(false);
    const [succes, setSucces] = useState<string>("");

    useEffect(() => {
        const local = localStorage.getItem("activeUser");

        if (local) {
            const user = JSON.parse(local);
            setEmail(user.email);
            setIsEmailLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!isEmailLoaded || !email) {
            return;
        }

        const connectWebSocket = () => {
            const websocket = new WebSocket("ws://localhost:8081");

            websocket.onopen = () => {
                console.log("Połączono z serwerem WebSocket");

                if (email) {
                    websocket.send(JSON.stringify({ email }));
                } else {
                    console.error("Brak adresu email użytkownika");
                }
            };

            websocket.onmessage = (event) => {
                const message = JSON.parse(event.data);

                if (message.type === "orderStatus") {
                    console.log("web socket frontowy dostal waidomosc o typie: ", message.type)
                    if (message.error) {
                        setError(message.error);
                    } else {
                        console.log("to status ktory bede aktualizowal", message.status)
                        setStatus({
                            status: message.status.status,
                            orderTime: message.status.orderTime,
                            estimatedTime: message.status.estimatedTime
                        });
                    }
                } else if (message.type === "orderStatus/update") {
                    if (message.error) {
                        setError(message.error)
                    } else {
                        console.log("to status ktory bede aktualizowal", message.status)
                        setStatus(prev => ({
                            ...prev,
                            status: message.status
                        }));
                    }
                }
            };

            websocket.onerror = (error) => {
                console.error("Błąd WebSocket:", error);
                setError("Błąd połączenia z serwerem");
                setTimeout(connectWebSocket, 5000);
            };

            websocket.onclose = () => {
                console.log("Połączenie WebSocket zamknięte");
                setError("Połączenie WebSocket zostało zamknięte");
            };

            return websocket;
        };

        const websocket = connectWebSocket();

        return () => {
            if (websocket) {
                websocket.close();
            }
        };
    }, [isEmailLoaded, email]);

    function receivedOrder() {
        axios.post('http://localhost:3001/orders/reveivedOrder', { email })
            .then(res => {
                setStatus({
                    status: "None",
                    orderTime: null,
                    estimatedTime: null
                });
                setError("");
                setSucces("Zaznaczono że odebrano!");
                console.log(res.data.message);
            })
            .catch(error => {
                const message = error.response?.data?.message || "Błąd połączenia z serwerem";
                console.log(message);
                setSucces("");
                setError(message);
            });
    }

    function deletedOrderAccept() {
        axios.post('http://localhost:3001/orders/deletedReaction', { email })
            .then(res => {
                setStatus({
                    status: "None",
                    orderTime: null,
                    estimatedTime: null
                })
                setError("")
                setSucces(res.data.message)
            })
            .catch(error => {
                const message = error.response?.data?.message || "Błąd połączenia z serwerem";
                console.log(message);
                setSucces("");
                setError(message);
            });
    }

    return (
        <div className="flex items-center justify-center h-[40vh] w-[80vh] text-center bg-yellow-200 border rounded-2xl">
            <div>
                <h1 className="text-3xl font-bold mb-4 text-yellow-800">Stan zamówienia:</h1>
                {status.status === "In progress" && (
                    <div>
                        <div className="text-2xl text-blue-500 font-medium">Twoje zamówienie jest przetwarzane!</div>
                        {status.orderTime && status.estimatedTime && (
                            <div className="space-y-4">
                                <div className="bg-blue-100 p-4 rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold text-blue-700">Czas złożenia zamówienia:</h2>
                                    <div className="text-lg text-gray-800">{status.orderTime}</div>
                                </div>
                                <div className="bg-green-100 p-4 rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold text-green-700">Oczekiwany czas przygotowania zamówienia:</h2>
                                    <div className="text-lg text-gray-800">{status.estimatedTime}</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {status.status === "Ready" && (
                    <div>
                        <div className="text-4xl text-green-600 underline">Twoje zamówienie jest gotowe!</div>
                        <button
                            className="bg-yellow-600 border rounded-md hover:bg-yellow-700 p-2 m-6 w-48 border-none"
                            onClick={receivedOrder}
                        >
                            Odebrałem!
                        </button>
                    </div>
                )}
                {status.status === "None" && (
                    <div className="text-4xl text-gray-600">Nie złożono jeszcze zamówienia!</div>
                )}
                {status.status === "Deleted" && (
                    <div className="text-4xl text-red-500">
                        <div>Twoje zamówienie zostało cofnięte! Skontaktuj się z lokalem aby dowiedzieć się więcej.</div>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            onClick={deletedOrderAccept}
                        >
                            Rozumiem
                        </button>
                    </div>
                )}
            </div>
            {succes !== "" && (
                <ModalSucces message={succes} hideModal={() => setSucces("")} />
            )}
            {error !== "" && (
                <ModalError error={error} hideModal={() => setError("")} />
            )}
        </div>
    );
};
