'use client'

import { useState, useEffect } from "react";

type Order = {
    id: string;
    name: string;
    add?: string[];
    del?: string[];
    size?: string;
    imageUrl: string;
    price: string;
    type: string;
    _id: string;
}

interface OrderProps {
    order: Order[];
    orderType: string;
    orderDetails: string;
    email: string;
}

export default function StaffMain() {
    const [orders, setOrders] = useState<OrderProps[]>([]);

    useEffect(() => {
        const ord = localStorage.getItem("ordersList")
        if (ord) {
            setOrders(JSON.parse(ord))
        }
    }, [])

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");

        socket.onopen = () => {
            console.log("Połączono z WebSocket");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "newOrder") {
                console.log("Nowe zamówienie:", data.order);

                setOrders(prev => [...prev, data.order]);

                localStorage.setItem("ordersList", JSON.stringify(orders))
            }
        };

        socket.onclose = () => {
            console.log("Połączenie WebSocket zamknięte");
        };

        socket.onerror = (error) => {
            console.error("Błąd WebSocket: ", error);
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Lista zamówień:</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order, index) => (
                    <li
                        key={index}
                        className="p-4 border rounded-md shadow-sm bg-white max-h-[400px] overflow-y-auto"
                    >
                        <h2 className="text-xl font-semibold mb-2">
                            Zamówienie {index + 1}
                        </h2>
                        {order.order.map((obj, ind) => (
                            <div
                                key={ind}
                                className="mb-2 p-2 border rounded-md bg-gray-50"
                            >
                                <div className="font-medium">Nazwa: {obj.name}</div>
                                {obj.add?.length !== 0 && (
                                    <div className="mt-1">
                                        <div className="font-medium text-green-600">
                                            Dodać:
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            {obj.add?.map((addd, i) => (
                                                <div key={i}>{addd}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {obj.del?.length !== 0 && (
                                    <div className="mt-1">
                                        <div className="font-medium text-red-600">
                                            Bez:
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            {obj.del?.map((dell, i) => (
                                                <div key={i}>{dell}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {obj.size && (
                                    <div className="mt-1 text-sm text-gray-700">
                                        Rozmiar: {obj.size}
                                    </div>
                                )}
                                <div>
                                    <button>Zrobione</button>
                                </div>
                            </div>
                        ))}
                        <div className="mt-2">
                            <div className="font-medium">Typ zamówienia:</div>
                            <div className="text-sm text-gray-700">
                                {order.orderType}
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="font-medium">Detale zamówienia:</div>
                            <div className="text-sm text-gray-700">
                                {order.orderDetails}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

