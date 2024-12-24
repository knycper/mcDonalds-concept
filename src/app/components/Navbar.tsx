'use client';

import Link from "next/link";

export default function Navbar() {

    function logOut() {
        localStorage.removeItem('activeUser')
    }

    return (
        <div>
            <Link 
            href={"/"}
            onClick={logOut}
            >Wyloguj się</Link>
            <Link
            href={"/home/konto/info"}
            >Informacje o Koncie
            </Link>
            <Link
            href={"/home/konto/historia"}
            >Historia konta
            </Link>
        </div>
    )
}