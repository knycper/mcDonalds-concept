import { Drink, MenuData, Set, MenuItem } from "./types/types";

import Image from "next/image";

import useMenu from "./MenuContext";

export default function TypeMenu({ type, setSelectedItemId }) {
    const obiekt: MenuData = useMenu();

    if (!obiekt) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {type && (
                <div className="grid grid-cols-4 gap-6 overflow-y-auto p-4">
                    {type === "napoje" ? (
                        obiekt.napoje.map((napoj: Drink, ind: number) => (
                            <div
                                key={ind}
                                className="cursor-pointer bg-white p-4 rounded-lg shadow-md hover:scale-105 transition-transform flex flex-col items-center"
                                onClick={() => setSelectedItemId(napoj.id)}
                            >
                                <h3 className="text-lg font-semibold text-yellow-600 uppercase text-center">
                                    {napoj.name}
                                </h3>
                                <div className="text-gray-700 text-center">
                                    {napoj.price.map((wartosc, indeks) => (
                                        <div key={indeks}>{wartosc.name}: {wartosc.price} zł</div>
                                    ))}
                                </div>
                                <Image
                                    src={napoj.imageUrl}
                                    alt={`${napoj.name} zdjęcie`}
                                    width={150}
                                    height={100}
                                    className="mt-4 rounded-lg max-w-full"
                                />
                            </div>
                        ))
                    ) : type === "zestaw i 2 for you" ? (
                        obiekt.zestawy.map((zestaw: Set, ind: number) => (
                            <div
                                key={ind}
                                className="cursor-pointer bg-white p-4 rounded-lg shadow-md hover:scale-105 transition-transform flex flex-col items-center"
                                onClick={() => setSelectedItemId(zestaw.id)}
                            >
                                <h3 className="text-lg font-semibold text-yellow-600 uppercase text-center">
                                    {zestaw.name}
                                </h3>
                                <div className="text-gray-700 text-center">{zestaw.price}</div>
                                <Image
                                    src={zestaw.imageUrl}
                                    alt={`${zestaw.name} zdjęcie`}
                                    width={150}
                                    height={100}
                                    className="mt-4 rounded-lg max-w-full"
                                />
                            </div>
                        ))
                    ) : (
                        obiekt.menu
                            .filter((danie: MenuItem) => danie.type.some((typ) => typ === type))
                            .map((obj: MenuItem, ind: number) => (
                                <div
                                    key={ind}
                                    className="cursor-pointer bg-white p-4 rounded-lg shadow-md hover:scale-105 transition-transform flex flex-col items-center"
                                    onClick={() => setSelectedItemId(obj.id)}
                                >
                                    <h3 className="text-lg font-semibold text-yellow-600 uppercase text-center">
                                        {obj.name}
                                    </h3>
                                    <div className="text-gray-700 text-center">{obj.price} zł</div>
                                    <Image
                                        src={obj.imageUrl}
                                        alt={`${obj.name} zdjęcie`}
                                        width={150}
                                        height={100}
                                        className="mt-4 rounded-lg max-w-full"
                                    />
                                </div>
                            ))
                    )}
                </div>
            )}
        </div>
    );
}
