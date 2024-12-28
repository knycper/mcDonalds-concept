import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

type MenuItem = {
    id: number;
    name: string;
    price: string;
    ingredients?: string[];
    allergens: string[];
    type: string[];
    imageUrl: string;
    dodatki: string[];
};

type Drink = {
    name: string;
    price: {
        maly: string;
        sredni: string;
        duzy: string;
    };
    imageUrl: string;
};

type Set = {
    price: number;
    imageUrl: string;
};

type MenuData = {
    menu: MenuItem[];
    napoje: Drink[];
    types: string[];
    zestawy: {
        zwykly: Set;
        powiekszony: Set;
        "2_for_u": Set;
    };
};

export default function TypeMenu({ type }) {
    const [obiekt, setObiekt] = useState<MenuData>({
        menu: [],
        napoje: [],
        types: [],
        zestawy: {
            zwykly: { price: 0, imageUrl: "" },
            powiekszony: { price: 0, imageUrl: "" },
            "2_for_u": { price: 0, imageUrl: "" },
        },
    });

    const router = useRouter();

    useEffect(() => {
        axios.get("http://localhost:3001/file").then((res) => {
            const jsOn = res.data.message;
            setObiekt(jsOn);
        });
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {type === "napoje" ? (
                obiekt.napoje.map((napoj: Drink, ind: number) => (
                    <div
                        key={ind}
                        className="cursor-pointer bg-white p-4 rounded-lg shadow-md hover:bg-yellow-50 transition flex flex-col items-center"
                        onClick={() => router.push(`/home/${napoj.name}`)}
                    >
                        <h3 className="text-lg font-semibold text-yellow-600 uppercase text-center">
                            {napoj.name}
                        </h3>
                        <div className="text-gray-700 text-center">
                            <div>mały: {napoj.price.maly} zł</div>
                            <div>średni: {napoj.price.sredni} zł</div>
                            <div>duży: {napoj.price.duzy} zł</div>
                        </div>
                        <Image
                            src={napoj.imageUrl}
                            alt={`${napoj.name} zdjęcie`}
                            width={250}
                            height={300}
                            className="mt-4 rounded-lg max-w-full"
                        />
                    </div>
                ))
            ) : (
                obiekt.menu
                    .filter((danie) => danie.type.some((typ) => typ === type))
                    .map((obj: MenuItem, ind: number) => (
                        <div
                            key={ind}
                            className="cursor-pointer bg-white p-4 rounded-lg shadow-md hover:bg-yellow-50 transition flex flex-col items-center"
                            onClick={() => router.push(`/home/${obj.name}`)}
                        >
                            <h3 className="text-lg font-semibold text-yellow-600 uppercase text-center">
                                {obj.name}
                            </h3>
                            <div className="text-gray-700 text-center">{obj.price} zł</div>
                            <Image
                                src={obj.imageUrl}
                                alt={`${obj.name} zdjęcie`}
                                width={250}
                                height={300}
                                className="mt-4 rounded-lg max-w-full"
                            />
                        </div>
                    ))
            )}
        </div>
    );
}
