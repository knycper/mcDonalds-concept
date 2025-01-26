'use client';

import useMenu from "./MenuContext";
import LoadingSuspense from "./LoadingSuspense";

interface MenuProps {
    handle: (chosen: string) => void;
    chosen: string;
}

export default function Menu({ handle, chosen }: MenuProps) {
    const menuData = useMenu();

    if (!menuData) {
        return (
            <LoadingSuspense>Loading...</LoadingSuspense>
        );
    }

    return (
        <div className="flex flex-row bg-yellow-50 h-screen w-auto">
            {/* Left Menu */}
            <div className="bg-yellow-500 w-auto text-white p-6 shadow-lg overflow-y-auto">
                <h2 className="text-xl font-semibold mb-6 text-center">Kategorie</h2>
                <div className="space-y-4">
                    {menuData.types.map((type: string, index: number) => (
                        <div
                            key={index}
                            onClick={() => handle(type)}
                            className={`cursor-pointer px-6 py-3 rounded-md text-center hover:bg-yellow-600 transition ${chosen === type ? "bg-yellow-600" : ""
                                } uppercase`}
                        >
                            {type}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
