import { useState, useEffect } from "react";
import { MenuItem, AllOrders, NormalOrder, MenuData } from "../types/types";
import Image from "next/image";
import useMenu from "../MenuContext";

interface DisplayNormalOrderProps {
    itemId?: string;
    orderImported: AllOrders[];
    updateSite?: () => void;
    orderId?: string;
    rerender?: () => void
}

export default function DisplayNormalDrink({ itemId, orderImported, updateSite, orderId, rerender }: DisplayNormalOrderProps) {

    const [order, setOrder] = useState<AllOrders[]>([]);
    const [selected, setSelected] = useState<NormalOrder | null>(null);
    const [added, setAdded] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [item, SetItem] = useState<MenuItem | null>(null);
    const menu = useMenu() as MenuData | null;

    useEffect(() => {
        if (menu) {
            if (itemId) {
                const it = menu.menu.find(obj => obj.id === itemId)
                if (it) {
                    SetItem(it)
                }
            } else if (orderId) {
                const ord = order.find(obj => obj.id === orderId) as NormalOrder | undefined
                if (ord) {
                    const dr = menu.menu.find(obj => obj.name === ord.name)
                    if (dr) {
                        SetItem(dr)
                    }
                    setSelected(ord)
                }
            }
        }
    }, [itemId, menu, orderId, order])

    useEffect(() => {
        setOrder(orderImported);
    }, [orderImported, orderId]);

    useEffect(() => {
        if (order.length > 0) {
            localStorage.setItem("order", JSON.stringify(order));
        }
    }, [order]);

    return (
        <div></div>
    )
}