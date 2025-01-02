import Image from "next/image";
import { DrinkOrder } from "../types/types";

// Definicja właściwego typu dla historii napoju
interface HistoryDrinkProps {
    drinkOrder: DrinkOrder;  // Usuwam Order, ponieważ to może być zbędne
    price: boolean;
}

export default function HistoryDrink({ drinkOrder, price }: HistoryDrinkProps) {
    return (
        <div>
            {drinkOrder.size === "maly" && (
                <div>rozmiar: mały</div>
            )}
            {drinkOrder.size === "sredni" && (
                <div>rozmiar: średni</div>
            )}
            {drinkOrder.size === "duzy" && (
                <div>rozmiar: duży</div>
            )}

            <Image src={drinkOrder.imageUrl} alt={`${drinkOrder.name} zdjęcie`} height={150} width={150} />

            {price && (
                <div>{drinkOrder.price} zł</div>
            )}
        </div>
    )
}
