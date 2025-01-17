'use client';

import Link from "next/link";
import ModalAsking from "./modals/ModalAsking";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [modal, setModal] = useState<boolean>(false);

    const router = useRouter();

    function logOut() {
        localStorage.removeItem('activeUser');
        localStorage.removeItem('order')
        router.push("/")
        setModal(false)
    }

    return (
        <div className="bg-yellow-600 text-white p-4 shadow-md w-full">
            <div className="max-w-7xl mx-auto flex flex-shrink flex-wrap justify-between items-center space-x-2">
                <div className="flex space-x-6">
                    <Link
                        href="/home"
                        className="hover:text-yellow-300 transition"
                    >
                        Strona główna
                    </Link>
                    <Link
                        href="/home/order"
                        className="hover:text-yellow-300 transition relative"
                    >
                        Koszyk
                    </Link>
                    <Link
                        href="/home/order/info"
                        className="hover:text-yellow-300 transition"
                    >
                        Stan zamówienia
                    </Link>
                    <Link
                        href="/home/account"
                        className="hover:text-yellow-300 transition"
                    >
                        Konto
                    </Link>
                </div>

                <div>
                    <button
                        onClick={() => setModal(true)}
                        className="hover:text-yellow-300 transition"
                    >
                        Wyloguj się
                    </button>
                </div>
            </div>
            {modal && (
                <ModalAsking onClose={() => setModal(false)} onConfirm={logOut} message="logOut" />
            )}
        </div>
    );
}
