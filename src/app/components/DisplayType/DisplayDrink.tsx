import { useState, useEffect } from "react";
import { Drink, AllOrders, DrinkOrder, MenuData } from "../types/types";
import Image from "next/image";
import useMenu from "../MenuContext";
import axios from "axios";

interface DisplayDrinkProps {
    drinkId?: string;
    orderImported: AllOrders[];
    updateSite?: () => void;
    orderId?: string;
    rerender?: () => void;
}

export default function DisplayDrink({
    drinkId,
    orderImported,
    updateSite,
    orderId,
    rerender,
}: DisplayDrinkProps) {
    const [order, setOrder] = useState<AllOrders[]>([]);
    const [selected, setSelected] = useState<DrinkOrder | null>(null);
    const [added, setAdded] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [drink, SetDrink] = useState<Drink | null>(null);
    const [email, setEmail] = useState<string>("")
    const menu = useMenu() as MenuData | null;

    useEffect(() => {
        if (menu) {
            if (drinkId) {
                const dri = menu.napoje.find((obj) => obj.id === drinkId);
                if (dri) {
                    SetDrink(dri);
                }
            } else if (orderId) {
                const ord = order.find((obj) => obj.id === orderId) as DrinkOrder | undefined;
                if (ord) {
                    const dr = menu.napoje.find((obj) => obj.name === ord.name);
                    if (dr) {
                        SetDrink(dr);
                    }
                    setSelected(ord);
                }
            }
        }
    }, [drinkId, menu, orderId, order]);

    useEffect(() => {
        const storage = localStorage.getItem("activeUser")
        if (storage) {
            const objs = JSON.parse(storage)
            const final = objs.email
            setEmail(final)
        }
    }, [])

    useEffect(() => {
        setOrder(orderImported);
    }, [orderImported, orderId]);

    useEffect(() => {
        if (order.length > 0) {
            localStorage.setItem("order", JSON.stringify(order));
        }
    }, [order]);

    function setId() {
        if (order.length === 0) {

            return "1";
        } else {
            const lastId = order[order.length - 1].id;
            const newId = Number(lastId) + 1;
            return `${newId}`;
        }
    }

    function handleSelectingDrink(size: string, price: string) {
        if (!drink) return;

        setSelected({
            id: setId(),
            name: drink.name,
            price,
            size,
            imageUrl: drink.imageUrl,
            type: "DrinkOrder"
        });
    }

    function confirmed() {
        setError("");
        setAdded(true);
        setTimeout(() => {
            if (orderId) {
                if (rerender) {
                    rerender();
                }
            } else {
                if (updateSite) {
                    updateSite();
                }
            }
        }, 1000);
    }

    function handleAddToOrder() {
        if (selected) {
            if (orderId) {
                const sel = ({
                    ...selected,
                    id: orderId
                })
                const data = {
                    orderId,
                    email: email,
                    updated: sel
                }
                axios.put('http://localhost:3001/orders/updateOrder', data)
                    .then(() => {
                        const newOrder = order.map((obj) => {
                            if (obj.id === orderId && selected) {
                                return {
                                    ...obj,
                                    price: selected.price,
                                    size: selected.size,
                                };
                            }
                            return obj;
                        });
                        setOrder(newOrder);
                        confirmed()
                    })
                    .catch(error => {
                        const message = error.response?.data?.message || "Błąd połączenia z serwerem";
                        console.log(message);
                        setError(message);
                    })
            } else {
                const data = {
                    email,
                    order: selected
                }
                axios.post('http://localhost:3001/orders/add', data)
                    .then(() => {
                        setOrder((prev) => [...prev, selected]);
                        confirmed()
                    })
                    .catch(error => {
                        const message = error.response?.data?.message || "Błąd połączenia z serwerem";
                        console.log(message);
                        setError(message);
                    })
            }
        } else {
            setError(
                "Nie wybrano jeszcze wielkości napoju. Naciśnij na wybrany rozmiar, a następnie zatwierdź!"
            );
        }
    }

    if (!drink) {
        return <div>Ładowanie...</div>;
    }

    return (
        <div className="bg-yellow-100 text-yellow-800 p-6 rounded-md shadow-lg w-full max-w-60 mx-auto">
            <div className="flex flex-row">
                <div>
                    <div className="text-2xl font-bold mb-4">{drink.name}</div>
                    <div className="text-xl font-semibold mb-4">Cena: {drink.price[0].price} zł</div>
                    <Image src={drink.imageUrl} alt={`${drink.name} zdjęcie`} width={150} height={150} />
                </div>
            </div>
            <div className="flex flex-col gap-6 mb-4">
                <div className="flex flex-col gap-2 w-full">
                    {drink.price.map((obj, ind) => (
                        <button
                            key={ind}
                            onClick={() => handleSelectingDrink(obj.name, obj.price)}
                            className={`w-full py-2 px-4 rounded-md transition-colors text-center font-medium ${selected?.size === obj.name
                                ? "bg-yellow-600 text-white shadow-lg"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {obj.name}: {obj.price} zł
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleAddToOrder}
                className="bg-yellow-600 text-white px-6 py-2 rounded-md font-medium w-full transition-transform duration-300 hover:scale-105"
            >
                Zatwierdź zmiany i dodaj
            </button>

            {added && (
                <div className="mt-4 text-green-600 font-medium text-center">
                    {orderId ? "Zaktualizowano Zamówienie!" : "Dodano zamówienie!"}
                </div>
            )}

            {error.length !== 0 && (
                <div className="mt-2 text-red-600 font-medium w-full max-w-full text-center break-words">
                    {error}
                </div>
            )}
        </div>
    );
}
