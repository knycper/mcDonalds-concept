import { useState, useEffect } from "react";
import useMenu from "./MenuContext";
import LoadingSuspense from "./LoadingSuspense";
import { MenuItem, MenuData, Drink, Set, NormalOrder, DrinkOrder, ForYouOrder, AllOrders } from "./types/types";
import { use } from "react";
import DisplayDrink from "./DisplayDrink";

export default function ProductById({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [drink, setDrink] = useState<Drink | null>(null);
    const [set, setSet] = useState<Set | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [order, setOrder] = useState<AllOrders[]>([])

    const menuData: MenuData | null = useMenu();

    useEffect(() => {
        const ord = localStorage.getItem('order')
        if (ord) {
            setOrder(JSON.parse(ord))
        }
        async function resolveParams() {
            try {
                setLoading(true);
                const resolvedId = id;
                if (!menuData) return;

                const drinkItem = menuData.napoje.find((obiekt) => obiekt.id === resolvedId);
                const setItem = menuData.zestawy.find((obiekt) => obiekt.id === resolvedId);
                const menuItem = menuData.menu.find((obiekt) => obiekt.id === resolvedId);

                setDrink(drinkItem || null);
                setSet(setItem || null);
                setMenuItem(menuItem || null);
            } finally {
                setLoading(false);
            }
        }

        resolveParams();
    }, [id, menuData]);

    if (!menuData || loading) {
        return (
            <LoadingSuspense>Loading...</LoadingSuspense>
        );
    }

    return (
        <div className="flex justify-center items-center px-4">
            {drink && (
                <DisplayDrink drink={drink} orderImported={order} />
            )}
            {set && (
                <div>
                    <p>{set.name}</p>
                </div>
            )}
            {menuItem && (
                <div>
                    <p>{menuItem.name}</p>
                </div>
            )}
        </div>
    );
}
