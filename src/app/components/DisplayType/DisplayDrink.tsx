import { useState, useEffect } from "react";
import { Drink, AllOrders, DrinkOrder } from "../types/types";
import Image from "next/image";

interface DisplayDrinkProps {
    drink: Drink;
    orderImported: AllOrders[];
    updateSite: () => void;
}

export default function DisplayDrink({ drink, orderImported, updateSite }: DisplayDrinkProps) {
    const [order, setOrder] = useState<AllOrders[]>([]);
    const [selected, setSelected] = useState<DrinkOrder | null>(null);
    const [added, setAdded] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        setOrder(orderImported);
    }, [orderImported])

    useEffect(() => {
        if (order.length > 0) {
            localStorage.setItem('order', JSON.stringify(order));
        }
    }, [order]);

    function handleSelectingDrink(size: string, price: string) {
        setSelected({
            name: drink.name,
            price,
            size,
            imageUrl: drink.imageUrl
        });
    }

    function handleAddToOrder() {
        if (selected) {
            console.log(selected)
            setOrder((prev) => [...prev, selected]);
            setError('')
            setAdded(true)
            setTimeout(() => {
                updateSite()
            }, 1000)
        } else {
            setError('nie wybrano jeszcze wielkości napoju. Naciśnij na wybrany rozmiar a następnie zatwierdź!')
        }
    }


    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center max-w-3xl gap-2">
            <div className="text-lg font-semibold text-yellow-600 uppercase text-center mb-4">
                {drink.name}
            </div>
            <Image src={drink.imageUrl} alt={`${drink.name} zdjęcie`} width={200} height={200} />
            <div className="flex flex-col gap-4">
                {drink.price.map((obj, ind) => (
                    <button
                        key={ind}
                        onClick={() => handleSelectingDrink(obj.name, obj.price)}
                        className={`w-full py-2 px-4 rounded-md transition-colors text-center ${selected?.size === obj.name
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {obj.name}: {obj.price} zł
                    </button>
                ))}
            </div>
            <button onClick={handleAddToOrder} className="mt-4 py-2 px-6 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                Zatwierdź
            </button>
            {added && (
                <div>Dodano zamówienie!</div>
            )}
            {error.length !== 0 && (
                <div>{error}</div>
            )}
        </div>
    );
}
