'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import ModalSucces from "./modals/ModalSucces";
import ModalError from "./modals/ModalError";

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
    const [succes, setSucces] = useState<string>("")
    const [error, setError] = useState<string>("")

    function addMinutesToTime(currentTime: string, minutesToAdd: number) {
        const [hours, minutes] = currentTime.split(':').map(Number);

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        date.setMinutes(date.getMinutes() + minutesToAdd);

        const newHours = date.getHours().toString().padStart(2, '0');
        const newMinutes = date.getMinutes().toString().padStart(2, '0');

        return `${newHours}:${newMinutes}`;
    }

    useEffect(() => {
        const ord = localStorage.getItem("ordersList")
        if (ord) {
            setOrders(JSON.parse(ord))
        }
    }, [])

    function calculateTime(data, ilosc: number) {
        setOrders((prev) => {
            const updatedOrders = [...prev, data.order];
            localStorage.setItem("ordersList", JSON.stringify(updatedOrders));
            return updatedOrders;
        });

        const now = new Date();
        const hours = now.getHours()
        const minutes = now.getMinutes()
        const estimatedMinutes = ilosc * 3
        const estimatedTime = addMinutesToTime(`${hours}:${minutes}`, estimatedMinutes)
        return [estimatedTime, `${hours}:${minutes < 10 ? '0' + minutes : minutes}`]
    }

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");

        socket.onopen = () => {
            console.log("Połączono z WebSocket");
        };

        socket.onmessage = (event) => {
            console.log("przyszlo zamowienie")
            const data = JSON.parse(event.data);
            const local = localStorage.getItem("ordersList")
            if (!local) return;

            const ordersy = JSON.parse(local).length + 1

            if (data.type === "newOrder") {
                console.log("Nowe zamówienie:", data.order);

                const [estimatedTime, orderTime] = calculateTime(data, ordersy)
                const email = data.order.email

                socket.send(JSON.stringify({
                    orderTime: orderTime,
                    estimatedTime: `${estimatedTime}`,
                    email,
                    topic: "time"
                }))
            }
        };

        socket.onclose = () => {
            console.log("Połączenie WebSocket zamknięte");
        };

        socket.onerror = (error) => {
            console.error("Błąd WebSocket:", error);
        };

        return () => {
            socket.close();
        };
    }, []);

    function updateOrderStatus(email: string, status: string) {

        const data = {
            email,
            status
        }
        axios.post('http://localhost:3001/orders/publishedOrder/update', data)
            .then(res => {
                const newOrders = orders.filter(order => order.email !== email)

                setOrders(newOrders)

                localStorage.setItem("ordersList", JSON.stringify(newOrders))

                setError("")
                setSucces(res.data.message)
                setTimeout(() => {
                    setSucces("")
                }, 2000)
            })
            .catch(error => {
                const message = error.response?.data?.message || "Błąd połączenia z serwerem";
                console.log(message)
                setSucces("")
                setError(message)
            })
    }

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
                                className="mb-2 p-2 border rounded-md bg-gray-150"
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
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => updateOrderStatus(order.email, "Ready")}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                            >
                                Zamówienie gotowe
                            </button>
                            <button
                                onClick={() => updateOrderStatus(order.email, "Deleted")}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                                Usuń zamówienie
                            </button>
                        </div>

                    </li>
                ))}
            </ul>
            {succes !== "" && (
                <ModalSucces message={succes} hideModal={() => setSucces("")} />
            )}
            {error !== "" && (
                <ModalError error={error} hideModal={() => setError("")} />
            )}
        </div>
    );
}

