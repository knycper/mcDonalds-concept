'use client';

import TypeMenu from "./TypeMenu";

import axios from "axios";
import { useState, useEffect } from "react";

export default function Menu() {
    const [types, setTypes] = useState<string[]>([]);
    const [chosen, setChosen] = useState<string>("");

    useEffect(() => {
        axios.get("http://localhost:3001/file").then((res) => {
            const jsOn = res.data.message;
            setTypes(jsOn.types);
        });
        localStorage.setItem('order', JSON.stringify([]))
    }, []);

    return (
        <div className="flex flex-col md:flex-row bg-yellow-50 h-screen">
        {/* Left Menu */}
            <div className="bg-yellow-500 text-white w-full md:w-1/4 p-6 shadow-lg">
                <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">Kategorie</h2>
                <div className="space-y-4">
                    {types.map((type, index) => (
                        <div
                            key={index}
                            onClick={() => setChosen(type)}
                            className={`cursor-pointer px-6 py-3 rounded-md text-center hover:bg-yellow-600 transition ${
                                chosen === type ? "bg-yellow-600" : ""
                            } uppercase`}
                        >
                            {type}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-3/4 p-6 overflow-y-auto h-full">
                {chosen !== "" ? (
                    <TypeMenu type={chosen} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <h2 className="text-yellow-600 text-lg font-semibold text-2xl">
                            Wybierz typ produktu, który Cię interesuje!
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
}
