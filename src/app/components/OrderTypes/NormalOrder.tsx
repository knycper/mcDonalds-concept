import Image from "next/image";
import { NormalOrder } from "../types/types";
import Modal from "./Modal1";
import { useState } from "react";

interface HistoryNormalOrderProps {
    order: NormalOrder;
    price: boolean;
    editFunc: (id: string) => void;
    del: (id: string) => void;
}

export default function Normal({ order, price, editFunc, del }: HistoryNormalOrderProps) {

    const [showModal, setShowModal] = useState(false);

    function handleDelete() {
        setShowModal(true);
    }

    function handleConfirmDelete() {
        del(order.id);
        setShowModal(false);
    }

    function handleCloseModal() {
        setShowModal(false);
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center max-w-xs mx-auto border border-gray-200">
            <div className="text-lg font-semibold text-yellow-600 uppercase text-center mb-4">
                {order.name}
            </div>

            <Image
                src={order.imageUrl}
                alt={`${order.name} zdjęcie`}
                height={150}
                width={150}
                className="rounded-lg mb-4"
            />

            {(order.add.length !== 0 || order.del.length !== 0) && (
                <div className="w-full flex flex-row justify-between mt-4 gap-4">
                    {/* Dodatki */}
                    {order.add.length !== 0 && (
                        <div className="w-1/2 bg-green-100 p-4 rounded-lg">
                            <div className="text-green-600 font-semibold mb-2">Dodatki:</div>
                            <ul className="list-disc list-inside text-green-700">
                                {order.add.map((obj: string, i: number) => (
                                    <li key={i} className="mb-1">{obj}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Bez */}
                    {order.del.length !== 0 && (
                        <div className="w-1/2 bg-red-100 p-4 rounded-lg">
                            <div className="text-red-600 font-semibold mb-2">Bez:</div>
                            <ul className="list-disc list-inside text-red-700">
                                {order.del.map((obj: string, i: number) => (
                                    <li key={i} className="mb-1">{obj}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}


            {price === true && (
                <div className="text-xl font-bold text-yellow-600 mt-4 mb-4">
                    {order.price} zł
                </div>
            )}

            <div className="flex gap-3 w-full justify-center">
                <button
                    onClick={() => editFunc(order.id)}
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
