'use client';

import Link from "next/link";

export default function Navbar() {

    function logOut() {
        localStorage.removeItem('activeUser')
    }

    return (
        <div className="bg-yellow-600 text-white p-4 shadow-md w-full">
            <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
                <div className="flex space-x-6">
                    <Link
                        href="/home"
                        className="hover:text-yellow-300 transition"
                    >
                        Strona główna
                    </Link>
                    <Link
                        href="/a_order"
                        className="hover:text-yellow-300 transition"
                    >
                        Aktualne zamówienie
                    </Link>
                    <Link
                        href="/home/konto/info"
                        className="hover:text-yellow-300 transition"
                    >
                        Informacje konta
                    </Link>
                    <Link
                        href="/home/konto/historia"
                        className="hover:text-yellow-300 transition"
                    >
                        Historia zamówień
                    </Link>
                </div>

                <div>
                    <Link 
                        href="/"
                        onClick={logOut}
                        className="hover:text-yellow-300 transition"
                    >
                        Wyloguj się
                    </Link>
                </div>
            </div>
        </div>
    );
}
