'use client'

import { useEffect, useState } from "react";
import { AllOrders, SetOrder, NormalOrder, DrinkOrder, ForYouOrder, SosOrder } from "@/app/components/types/types";
import HistorySet from "@/app/components/TypesToShow/Set";
import HistoryForYou from "@/app/components/TypesToShow/ForYou"
import HistoryDrink from "@/app/components/TypesToShow/Drink"
import HistoryNormalOrder from "@/app/components/TypesToShow/NormalOrder"
import HistorySos from "@/app/components/TypesToShow/Sos";

export default function OrderPage() {
    const [order, setOrder] = useState<AllOrders[]>([]);

    useEffect(() => {
        const get = localStorage.getItem('order');
        if (get) {
            setOrder(JSON.parse(get));
        }
    }, []);

    const renderOrder = (value: AllOrders, ind: number) => {
        // Sprawdzanie typu zamówienia na podstawie właściwości
        if ("main" in value && "second" in value) {
            // Jeśli zamówienie ma pole 'main' oraz 'second', jest to SetOrder lub ForYouOrder
            if ("drink" in value) {
                // Jeżeli dodatkowo ma 'drink', to mamy do czynienia z SetOrder
                const setOrder = value as SetOrder;
                return (
                    <HistorySet setOrder={setOrder} />
                )
            } else {
                // Jeśli nie ma 'drink', to mamy do czynienia z ForYouOrder
                const forYouOrder = value as ForYouOrder;
                return (
                    <div key={ind}>
                        <HistoryForYou forYouOrder={forYouOrder} />
                    </div>
                );
            }
        } else if ("size" in value) {
            // Jeśli zamówienie ma pole 'size', to mamy do czynienia z DrinkOrder
            const drinkOrder = value as DrinkOrder;
            return (
                <div key={ind}>
                    <HistoryDrink drinkOrder={drinkOrder} price={true} />
                </div>
            );
        } else {
            // Inny przypadek (NormalOrder lub SosOrder)

            // Sprawdza czy w nazwie jest sos lub keczup
            if (value.name.includes("sos") || value.name === "keczup") {
                const sosOrder = value as SosOrder
                return (
                    <div key={ind}>
                        <HistorySos sosOrder={sosOrder} price={true} />
                    </div>
                )
            } else {
                // Inny przypadek NormalOrder
                const normalOrder = value as NormalOrder
                return (
                    <div key={ind}>
                        <HistoryNormalOrder order={normalOrder} price={true} />
                    </div>
                );
            }
        }
    };

    return (
        <div>
            {order.length !== 0 ? (
                order.map((value, ind) => renderOrder(value, ind))
            ) : (
                <div>Nie dodano jeszcze nic do zamówienia!</div>
            )}
        </div>
    );
}
