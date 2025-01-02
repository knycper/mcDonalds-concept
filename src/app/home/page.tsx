'use client';

import { useState } from "react";
import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import TypeMenu from "../components/TypeMenu";
import SelectedItemDetails from "../components/SelectedItemDetails"; // Twój komponent do wyświetlania szczegółów

export default function HomePage() {
    const [chosen, setChosen] = useState<string>("burgery");
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    function handleChangeType(chosen: string) {
        setSelectedItemId(null)
        setChosen(chosen)
    }

    function handleAddingItemToOrder() {
        setChosen('burgery')
        setSelectedItemId(null)
    }

    return (
        <div className="bg-yellow-50 h-full">
            <Navbar />
            <div className="flex">
                {/* Menu z kategoriami */}
                <Menu handle={(chosen: string) => handleChangeType(chosen)} chosen={chosen} />
                <div className="w-full p-4">
                    {/* Wyświetlanie szczegółów wybranego elementu lub menu */}
                    {selectedItemId ? (
                        <SelectedItemDetails
                            id={selectedItemId}
                            updateSite={handleAddingItemToOrder}
                        />
                    ) : (
                        <TypeMenu type={chosen} setSelectedItemId={setSelectedItemId} />
                    )}
                </div>
            </div>
        </div>
    );
}
