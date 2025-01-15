'use client'

interface LeftAccPageProps {
    logOut: () => void;
    accData: () => void;
    deleteAcc: () => void;
}

export default function LeftAccPage({ logOut, accData, deleteAcc }: LeftAccPageProps) {
    return (
        <div className="p-6 w-[80vh] mx-auto bg-white rounded-lg shadow-lg h-[16vh] mb-6">
            <div className="flex space-x-4">
                <button
                    onClick={accData}
                    className="flex-1 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                >
                    Dane konta
                </button>
                <button
                    onClick={() => console.log("histoira")}
                    className="flex-1 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                >
                    Historia zamówień
                </button>
                <button
                    onClick={logOut}
                    className="flex-1 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                >
                    Wyloguj
                </button>
                <button
                    onClick={deleteAcc}
                    className="flex-1 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                >
                    Usuń konto
                </button>
            </div>
        </div>
    )
}