import { useState, useEffect } from "react";
import { MenuItem, AllOrders, NormalOrder, MenuData } from "../types/types";
import Image from "next/image";
import useMenu from "../MenuContext";
import setId from "./functions/setId";
import addToOrder from "./functions/addToOrder";
import ModalError from "../OrderTypes/ModalError";
import ModalSucces from "../OrderTypes/ModalSucces";

interface DisplayNormalOrderProps {
    itemId?: string;
    orderImported: AllOrders[];
    updateSite?: () => void;
    orderId?: string;
    rerender?: () => void;
}

export default function DisplayNormalItem({ itemId, orderImported, updateSite, orderId, rerender }: DisplayNormalOrderProps) {

    const [order, setOrder] = useState<AllOrders[]>([]);
    const [selected, setSelected] = useState<NormalOrder | null>(null);
    const [added, setAdded] = useState<boolean>(false);
    const [item, SetItem] = useState<MenuItem | null>(null);
    const [allerg, setAllerg] = useState<boolean>(false);
    const [error, setError] = useState<string>("")
    const menu = useMenu() as MenuData | null;

    useEffect(() => {
        if (menu) {
            if (itemId) {
                const it = menu.menu.find(obj => obj.id === itemId);
                if (it) {
                    SetItem(it);
                    const startSelected = {
                        id: setId(order),
                        name: it.name,
                        price: it.price,
                        add: [],
                        del: [],
                        imageUrl: it.imageUrl,
                        type: "NormalOrder",
                    };
                    setSelected(startSelected);
                }
            } else if (orderId) {
                const ord = order.find(obj => obj.id === orderId) as NormalOrder | undefined;
                if (ord) {
                    const dr = menu.menu.find(obj => obj.name === ord.name);
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

    useEffect(() => {
        addToOrder(order);
    }, [order]);

    useEffect(() => {
        if (!item || !selected || !item.ingredients) return;

        if (selected.del.length === item.ingredients.length) {
            setError("nie można usunąć wszystkich składników!");
            const newDel = selected.del.slice(0, -1);

            setSelected(prev => ({
                ...prev!,
                del: newDel,
            }));
        }
    }, [item, selected]);


    function toDel(obj: string) {
        if (selected) {
            const isAlreadyInDel = selected.del.includes(obj);

            const updatedDel = isAlreadyInDel
                ? selected.del.filter(item => item !== obj)
                : [...selected.del, obj];
            setSelected({
                ...selected,
                del: updatedDel,
            });
            console.log(selected.del)
        }
    }

    function handleAddToOrder() {
        if (selected) {
            if (orderId) {
                const newOrder = order.map((obj) => {
                    if (obj.id === orderId && selected) {
                        return selected;
                    }
                    return obj;
                });
                setOrder(newOrder);
            } else {
                setOrder((prev) => [...prev, selected]);
            }
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
    }

    function sprawdzKropke(cena: string): string {
        if (cena.includes(".")) {
            return cena + "0"
        } else {
            return cena
        }
    }

    function toAdd(obj: string) {
        if (selected) {
            const isAlreadyInAdd = selected.add.includes(obj);

            // const priceChange = "2.5";
            // const newPrice = isAlreadyInAdd
            //     ? Number(selected.price.replace(/^0+/, '')) - Number(priceChange)
            //     : Number(selected.price.replace(/^0+/, '')) + Number(priceChange);

            // console.log(newPrice)
            // console.log(selected.price, " - ", priceChange, " = ", newPrice)

            const updatedAdd = isAlreadyInAdd
                ? selected.add.filter(item => item !== obj)
                : [...selected.add, obj];

            // const finalPrice = sprawdzKropke(String(newPrice))
            // console.log(finalPrice)

            setSelected({
                ...selected,
                // price: finalPrice,
                add: updatedAdd,
            });
        }
    }

    function hideModalError() {
        setError("")
    }

    function hideModalSucces() {
        setAdded(false)
    }

    if (!item || !selected) {
        return <div className="text-yellow-600 font-bold">Ładowanie...</div>;
    }

    return (
        <div className="bg-yellow-100 text-yellow-800 p-6 rounded-md shadow-lg w-full max-w-3xl mx-auto max-h-[80vh] overflow-y-auto">
            <div className="flex flex-row">
                <div>
                    <div className="text-2xl font-bold mb-4">{item.name}</div>
                    <div className="text-xl font-semibold mb-4">Cena: {item.price} zł</div>
                    <Image src={item.imageUrl} alt={`${item.name} zdjęcie`} width={150} height={150} />
                </div>
                <button
                    onClick={() => setAllerg(prev => !prev)}
                    className={`text-white px-4 py-2 rounded-md mb-4 ml-4 font-medium h-12 ${allerg ? "bg-yellow-600" : "bg-yellow-700"} transition-transform duration-300 hover:scale-105`}
                >
                    Wyświetl alergeny
                </button>
                <div
                    className={`m-4 flex flex-row w-max-32 relative transition-all duration-500 ease-in-out ${allerg ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
                        }`}
                >
                    {allerg && (
                        <div className="ml-3 bg-yellow-200 absolute p-4 rounded">
                            {item.allergens.map((obj, ind) => (
                                <div key={ind} className="mb-1">{obj}</div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 mb-4">
                {item.ingredients && (
                    <div className="flex-1">
                        {item.ingredients.length !== 0 && (
                            <div className="text-lg font-semibold mb-2">Składniki:</div>
                        )}
                        {item.ingredients.map((ingrid, ind) => (
                            <div key={ind} className="flex items-center justify-between mb-2">
                                {selected.del.includes(ingrid) ? (
                                    <span className="bg-red-200 text-red-600 font-bold px-2 py-1 rounded-md">{`${ingrid} -`}</span>
                                ) : (
                                    ingrid
                                )}
                                <button
                                    onClick={() => toDel(ingrid)}
                                    className={`px-3 py-1 rounded-md font-medium transition-colors duration-300 hover:scale-105 ${selected.del.includes(ingrid) ? "bg-yellow-600 text-white" : "bg-yellow-200"}`}
                                >
                                    {selected.del.includes(ingrid) ? "Dodaj" : "Usuń"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {item.dodatki && (
                    <div className="flex-1">
                        <div className="text-lg font-semibold mb-2">Dodatki:</div>
                        {item.dodatki.map((obj, ind) => (
                            <div key={ind} className="flex items-center justify-between mb-2">
                                <div className={`px-2 py-1 rounded-md ${selected.add.includes(obj) ? "bg-green-200 text-green-600 font-bold" : ""}`}>
                                    {selected.add.includes(obj) ? `${obj} + 2,50 zł` : obj}
                                </div>

                                <button
                                    onClick={() => toAdd(obj)}
                                    className={`transition-colors px-3 py-1 rounded-md font-medium ${selected.add.includes(obj) ? "bg-yellow-600 text-white" : "bg-yellow-200"} transition-transform duration-300 hover:scale-105`}
                                >
                                    {selected.add.includes(obj) ? "Cofnij" : "Dodaj"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button
                onClick={handleAddToOrder}
                className="bg-yellow-600 text-white px-6 py-2 rounded-md font-medium w-full transition-transform duration-300 hover:scale-105"
            >
                Zatwierdź zmiany i dodaj
            </button>
            {added && (
                <ModalSucces message={"Dodano zamówienie!"} hideModal={hideModalSucces} />
            )}
            {error.length !== 0 && (
                <ModalError error={error} hideModal={hideModalError} />
            )}
        </div>
    );
}
