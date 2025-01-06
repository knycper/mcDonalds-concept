import { AllOrders, SetOrder, NormalOrder, DrinkOrder, ForYouOrder, SosOrder } from "@/app/components/types/types";
import Set from "@/app/components/OrderTypes/Set";
import ForYou from "@/app/components/OrderTypes/ForYou";
import Drink from "@/app/components/OrderTypes/Drink";
import Normal from "@/app/components/OrderTypes/NormalOrder";
import Sos from "@/app/components/OrderTypes/Sos";
import { useState, useEffect } from "react";
import DisplayDrink from "./DisplayType/DisplayDrink";

export default function OrderList() {
    const [order, setOrder] = useState<AllOrders[]>([]);
    const [showOrder, setShowOrder] = useState<boolean>(true);
    const [orderId, setOrderId] = useState<string>('');

    useEffect(() => {
        loadLocal();
    }, []);

    function loadLocal() {
        const get = localStorage.getItem('order');
        if (get) {
            setOrder(JSON.parse(get));
        }
    }

    const showEdit = (id: string) => {
        setShowOrder(false);
        setOrderId(id);
    }

    function del(id: string) {
        const newOrder = order.filter(obj => obj.id !== id);
        localStorage.setItem("order", JSON.stringify(newOrder));
        loadLocal();
    }

    function DisplayEdit({ id }: { id: string }) {
        const val = order.find(ord => ord.id === id);
        if (val) {
            if (val.type === "NormalOrder") {
                return (
                    <div>Edytowanie zamówienia typu NormalOrder</div>
                );
            } else if (val.type === "DrinkOrder") {
                return (
                    <DisplayDrink orderImported={order} orderId={id} rerender={rerender} />
                );
            } else if (val.type === "SetOrder") {
                return (
                    <div>Edytowanie zamówienia typu SetOrder</div>
                );
            } else if (val.type === "ForYouOrder") {
                return (
                    <div>Edytowanie zamówienia typu ForYouOrder</div>
                );
            } else if (val.type === "SosOrder") {
                return (
                    <div>Edytowanie zamówienia typu SosOrder</div>
                );
            }
        } else {
            setOrderId('')
        }
    }

    // zrobic liste typow i mapowac po niej aby bylo ladniej!!! 
    const renderOrder = (value: AllOrders, ind: number) => {
        if (value.type === "NormalOrder") {
            const normalOrder = value as NormalOrder;
            return (
                <div key={ind} className="rounded-lg mb-4">
                    <Normal order={normalOrder} price={true} />
                </div>
            );
        } else if (value.type === "DrinkOrder") {
            const drinkOrder = value as DrinkOrder;
            return (
                <div key={ind} className=" p-4 rounded-lg mb-4">
                    <Drink drinkOrder={drinkOrder} price={true} editFunc={showEdit} del={del} />
                </div>
            );
        } else if (value.type === "SetOrder") {
            const setOrder = value as SetOrder;
            return (
                <div key={ind} className="rounded-lg shadow-md mb-4">
                    <Set setOrder={setOrder} />
                </div>
            );
        } else if (value.type === "ForYouOrder") {
            const forYouOrder = value as ForYouOrder;
            return (
                <div key={ind} className="rounded-lg shadow-md mb-4">
                    <ForYou forYouOrder={forYouOrder} />
                </div>
            );
        } else if (value.type === "SosOrder") {
            const sosOrder = value as SosOrder;
            return (
                <div key={ind} className="rounded-lg shadow-md mb-4">
                    <Sos sosOrder={sosOrder} price={true} />
                </div>
            );
        }
    };

    function rerender() {
        loadLocal();
        setOrderId('');
    }

    return (
        <div className=" min-w-min flex flex-row gap-6 bg-transparent">
            {/* List of orders */}
            <div className="w-full lg:w-1/2 h-[80vh] overflow-y-auto rtl p-4 rounded-lg">
                {order.length !== 0 ? (
                    order.map((value, ind) => renderOrder(value, ind))
                ) : (
                    <div className="text-center text-lg font-semibold text-yellow-600">Nie dodano jeszcze nic do zamówienia!</div>
                )}
            </div>

            {/* Edit selected order */}
            {orderId !== '' && (
                <div className="w-1/2 flex justify-center p-6 items-center">
                    <DisplayEdit id={orderId} />
                </div>
            )}
        </div>
    );
}
