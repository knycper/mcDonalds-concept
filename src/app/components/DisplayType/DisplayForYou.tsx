import { useState, useEffect } from "react"
import { Set, AllOrders, ForYouOrder, MenuData } from "../types/types";
import Image from "next/image";
import useMenu from "../MenuContext";
import setId from "./functions/setId";
import addToOrder from "./functions/addToOrder";
import ModalError from "../OrderTypes/ModalError";
import ModalSucces from "../OrderTypes/ModalSucces";

interface DisplayForYouOrderProps {
    itemId?: string;
    orderImported: AllOrders[];
    updateSite?: () => void;
    orderId?: string;
    rerender?: () => void;
}

export default function DisplayForYou({ itemId, orderImported, updateSite, orderId, rerender }: DisplayForYouOrderProps) {
    const [order, setOrder] = useState<AllOrders[]>([]);
    const [selected, setSelected] = useState<ForYouOrder | null>(null);
    const [added, setAdded] = useState<boolean>(false);
    const [item, SetItem] = useState<Set | null>(null);
    const [error, setError] = useState<string>("")
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const menu = useMenu() as MenuData | null;

    useEffect(() => {
        if (menu) {
            if (itemId) {
                const it = menu.zestawy.find(obj => obj.id === itemId);
                if (it) {
                    SetItem(it);
                    const startSelected = {
                        id: setId(order),
                        price: it.price,
                        name: it.name,
                        main: it.main,
                        second: it.second,
                        type: "ForYouOrder",
                    };
                    setSelected(startSelected);
                }
            } else if (orderId) {
                const ord = order.find(obj => obj.id === orderId) as ForYouOrder | undefined;
                if (ord) {
                    const dr = menu.zestawy.find(obj => obj.name === ord.name);
                    if (dr) {
                        SetItem(dr);
                    }
                    setSelected(ord);
                }
            }
        }
    }, [itemId, menu, orderId, order]);

    useEffect(() => {
        setOrder(orderImported);
    }, [orderImported]);


    return (
        <div></div>
    )
}