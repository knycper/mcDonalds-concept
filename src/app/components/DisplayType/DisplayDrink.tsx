import { useState, useEffect } from "react";
import { Drink, AllOrders, DrinkOrder, MenuData } from "../types/types";
import Image from "next/image";
import useMenu from "../MenuContext";

interface DisplayDrinkProps {
    drinkId?: string;
    orderImported: AllOrders[];
    updateSite?: () => void;
    orderId?: string;
    rerender?: () => void
}

export default function DisplayDrink({ drinkId, orderImported, updateSite, orderId, rerender }: DisplayDrinkProps) {
    const [order, setOrder] = useState<AllOrders[]>([]);
    const [selected, setSelected] = useState<DrinkOrder | null>(null);
    const [added, setAdded] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [drink, SetDrink] = useState<Drink | null>(null);
    const menu = useMenu() as MenuData | null;

    useEffect(() => {
        if (menu) {
            if (drinkId) {
                const dri = menu.napoje.find(obj => obj.id === drinkId)
                if (dri) {
                    SetDrink(dri)
                }
            } else if (orderId) {
                const ord = order.find(obj => obj.id === orderId) as DrinkOrder | undefined
                if (ord) {
                    const dr = menu.napoje.find(obj => obj.name === ord.name)
                    if (dr) {
                        SetDrink(dr)
                    }
                    setSelected(ord)
                }
            }
        }
    }, [drinkId, menu, orderId, order])

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
            return "1"
        } else {
            const lastId = order[order.length - 1].id
            const newId = Number(lastId) + 1
            return `${newId}`
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

    function handleAddToOrder() {
        if (selected) {
            if (orderId) {
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
            } else {
                setOrder((prev) => [...prev, selected]);
            }
            setError("");
            setAdded(true);
            setTimeout(() => {
                if (orderId) {
                    if (rerender) {
                        rerender()
                    }
                } else {
                    if (updateSite) {
                        updateSite()
                    }
                }
            }, 1000);
        } else {
            setError(
                "Nie wybrano jeszcze wielkości napoju. Naciśnij na wybrany rozmiar, a następnie zatwierdź!"
            );
        }
    }

    if (!drink) {
        return <div>Ładowanie...</div>
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center max-w-60 gap-4 border border-gray-200 max-h-min">
            <div className="text-lg font-semibold text-yellow-600 uppercase text-center mb-4 tracking-wide">
                <div>{drink.name}</div>
            </div>
            <div className="mb-4">
                <Image
                    src={drink.imageUrl}
                    alt={`${drink.name} zdjęcie`}
                    width={200}
                    height={200}
                    className="rounded-lg"
                />
            </div>
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
            <button
                onClick={handleAddToOrder}
                className="mt-4 py-2 px-6 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-transform transform hover:scale-105 shadow-md"
            >
                Zatwierdź
            </button>
            {added && (
                <div className="mt-2 text-green-600 font-medium justify-center">
                    {orderId ? (
                        <div>Zaktualizowano Zamówienie!</div>
                    ) : (
                        <div>Dodano zamówienie!</div>
                    )}
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
