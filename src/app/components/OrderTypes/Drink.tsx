import Image from "next/image";
import { DrinkOrder } from "../types/types";
import { useState } from "react";
import Modal from "./Modal1";

interface DrinkProps {
    drinkOrder: DrinkOrder;
    price: boolean;
    editFunc: (id: string) => void;
    del: (id: string) => void;
}

export default function Drink({ drinkOrder, price, editFunc, del }: DrinkProps) {
    const [showModal, setShowModal] = useState(false);

    function handleDelete() {
        setShowModal(true);
    }

    function handleConfirmDelete() {
        del(drinkOrder.id);
        setShowModal(false);
    }

    function handleCloseModal() {
        setShowModal(false);
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center max-w-xs mx-auto border border-gray-200">
            <div className="text-lg font-semibold text-yellow-600 uppercase text-center mb-4">{drinkOrder.name}</div>

            {drinkOrder.size && (
                <div className="text-gray-600 mb-2">
                    Rozmiar: <span className="font-medium text-gray-800">{drinkOrder.size}</span>
                </div>
            )}

            <Image
                src={drinkOrder.imageUrl}
                alt={`${drinkOrder.name} zdjęcie`}
                width={150}
                height={150}
                className="rounded-lg mb-4"
            />

            {price && (
                <div className="text-xl font-bold text-yellow-600 mb-4">
                    {drinkOrder.price} zł
                </div>
            )}

            <div className="flex gap-3 w-full justify-center">
                <button
                    onClick={() => editFunc(drinkOrder.id)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition w-full"
                >
                    Edytuj
                </button>
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition w-full"
                >
                    Usuń z zamówienia
                </button>
            </div>

            {showModal && (
                <Modal
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
}
