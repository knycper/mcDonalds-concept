'use client'

import Navbar from "../components/Navbar";
import Menu from "../components/Menu";
import LoadingSuspense from "../components/LoadingSuspense";
import TypeMenu from "../components/TypeMenu";
import { useState } from "react";

export default function HomePage() {
    const [chosen, setChosen] = useState<string>("burgery"); // Stan dla wybranego typu

    return (
        <LoadingSuspense>
            <div className="bg-yellow-50 h-full">
                <Navbar />
                <div className="flex">
                    <div className="">
                        <Menu setChosen={setChosen} />
                    </div>
                    <div className="w-full p-4">
                        <TypeMenu type={chosen} />
                    </div>
                </div>
            </div>
        </LoadingSuspense>
    );
}
