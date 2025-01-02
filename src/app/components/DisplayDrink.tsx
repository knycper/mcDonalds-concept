import { useState, useEffect } from "react";
import { Drink, AllOrders, DrinkOrder } from "./types/types";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DisplayDrink({ drink, orderImported }: { drink: Drink, orderImported: AllOrders[] }) {
    const [order, setOrder] = useState<AllOrders[]>([]);
    const [selected, setSelected] = useState<DrinkOrder | null>(null);
    const [added, setAdded] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const router = useRouter()

    useEffect(() => {
        setOrder(orderImported);
    }, [])

    function handleSelectingDrink(size: string, price: string) {
        setSelected({
            name: drink.name,
            price,
            size,
        });
    }

    function handleAddToOrder() {
        if (selected) {
            setOrder((prev) => [...prev, selected]);
            localStorage.setItem('order', JSON.stringify(order))
            setError('')
            setAdded(true)
            router.back()
        } else {
            setError('nie wybrano jeszcze wielkości napoju. Naciśnij na wybrany rozmiar a następnie zatwierdź!')
        }
    }


    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
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
            <button onClick={handleAddToOrder} className="mt-4 py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600">
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
