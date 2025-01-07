'use client'

import { useState, useEffect } from "react";
import useMenu from "./MenuContext";
import LoadingSuspense from "./LoadingSuspense";
import { MenuItem, MenuData, Drink, Set, AllOrders } from "./types/types";
import DisplayDrink from "./DisplayType/DisplayDrink";
import DisplayNormalItem from "./DisplayType/DisplayNormalItem";

interface SelectedItemDetailsProps {
    id: string;
    updateSite: () => void;
}

export default function SelectedItemDetails({ id, updateSite }: SelectedItemDetailsProps) {
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [drink, setDrink] = useState<Drink | null>(null);
    const [setItem, setSetItem] = useState<Set | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [order, setOrder] = useState<AllOrders[]>([]);

    const menuData: MenuData | null = useMenu();

    useEffect(() => {
        const storedOrder = localStorage.getItem("order");
        if (storedOrder) {
            setOrder(JSON.parse(storedOrder));
        }

        if (!menuData) return;

        setLoading(true);
        const drinkItem = menuData.napoje.find((obiekt: Drink) => obiekt.id === id);
        const setItem = menuData.zestawy.find((obiekt: Set) => obiekt.id === id);
        const menuItem = menuData.menu.find((obiekt: MenuItem) => obiekt.id === id);

        setDrink(drinkItem || null);
        setSetItem(setItem || null);
        setMenuItem(menuItem || null);
        setLoading(false);
    }, [id, menuData]);

    if (loading || !menuData) {
        return <LoadingSuspense>Loading...</LoadingSuspense>;
    }

    return (
        <div className="flex justify-center items-center px-4">
            {drink && (
                <DisplayDrink drinkId={drink.id} orderImported={order} updateSite={updateSite} />
            )}
            {setItem && (
                <div className="bg-white p-4 rounded shadow-md">
                    <h2 className="text-lg font-bold">{setItem.name}</h2>
                    <p className="text-gray-700">Cena: {setItem.price} zł</p>
                </div>
            )}
            {menuItem && (
                <DisplayNormalItem itemId={menuItem.id} orderImported={order} updateSite={updateSite} />
            )}
        </div>
    );
}
