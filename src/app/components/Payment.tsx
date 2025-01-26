import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

interface PaymentProps {
    price: string;
    handleBack: () => void;
    orderSet: () => void;
}

export default function Payment({ price, handleBack, orderSet }: PaymentProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [info, setInfo] = useState<string>("");
    const [orderType, setOrderType] = useState<string>("")
    const [toEditOrderType, setToEditOrderType] = useState<string>("")
    const [orderDetails, setORderDetails] = useState<string>("")
    const [ok, setOk] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [delAdress, setDelAdress] = useState<string>("")
    const [phoneNr, setPhoneNr] = useState<string>("")
    const [email, setEmail] = useState<string>("")

    useEffect(() => {
        const local = localStorage.getItem("activeUser")
        if (local) {
            const parse = JSON.parse(local)
            setEmail(parse.email)
        }
    }, [])

    const handlePayment = async () => {
        setInfo("Przetwarzanie transakcji...");
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));

            setInfo("Płatność zakończona sukcesem!");

            try {
                await axios.post('http://localhost:3001/orders/publishedOrder', { email, orderDetails, orderType });

                setInfo("Status zamówienia zaktualizowano pomyślnie! Sprawdź go w zakładce 'Stan zamówienia'");

                setTimeout(() => {
                    setIsLoading(false);
                    setInfo("");
                    localStorage.setItem("order", JSON.stringify([]))
                    orderSet()
                    closeModal();
                }, 1000);
            } catch (error) {
                const message = error.response?.data?.message || "Błąd połączenia z serwerem";
                console.log(message);
                setError(message);
                setIsLoading(false);
                setInfo("");
                closeModal();
            }

        } catch (error) {
            console.log(error);
            setError("Błąd przetwarzania płatności, spróbuj ponownie");
            setIsLoading(false);
            setInfo("");
            closeModal();
        }
    };


    const closeModal = () => {
        setIsLoading(false);
        setInfo("");
        handleBack();
    };

    function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            const inputValue = (e.target as HTMLInputElement).value;
            const number = Number(inputValue)
            if (number > 0 && number <= 25) {
                setError("")
                setOk("Dokonano wyboru!")
                setTimeout(() => {
                    setOrderType(toEditOrderType)
                    setORderDetails(inputValue)
                    setToEditOrderType("")
                    setOk("")
                }, 1500)
            } else {
                setError("Należy podać numer miedzy 1 a 25")
            }
        }
    }

    function handleDecision(val: string) {
        setError("")
        setOk("Dokonano wyboru!")
        setTimeout(() => {
            setORderDetails(val)
            setOrderType(toEditOrderType)
            setToEditOrderType("")
            setOk("")
        }, 1500)
    }

    function getDeliveryInfo() {
        const storage = localStorage.getItem("activeUser")
        if (storage) {
            const object = JSON.parse(storage)
            const adress = object.adress
            const phoneNr = object.phoneNumber
            if (adress) {
                setDelAdress(adress)
            }

            if (phoneNr) {
                setPhoneNr(phoneNr)
            }
        }
    }

    function handleEnterDel(e: React.KeyboardEvent<HTMLInputElement>, type: string) {
        if (e.key === "Enter") {
            const inputValue = (e.target as HTMLInputElement).value;
            if (type === "adress") {
                setDelAdress(inputValue)
            } else {
                const phoneRegex = /^(\+48\s?)?(\d{3}[-\s]?){2}\d{3}$/;
                if (phoneRegex.test(inputValue)) {
                    setError("")
                    setPhoneNr(inputValue)
                } else {
                    setError("Podany numer telefonu ma nieodpowiednią formę. Prosze podać jeszcze raz (np. 123 456 789)")
                }
            }
        }
    }

    function handleDelvieryChoice() {
        setToEditOrderType("dostawa do domu")
        getDeliveryInfo()
    }

    function submitDelivery() {
        if (phoneNr !== "" && delAdress !== "") {
            setError("")
            setOk("Dokonano wyboru!")
            setTimeout(() => {
                setOrderType(toEditOrderType)
                setORderDetails(delAdress + "|" + phoneNr)
                setToEditOrderType("")
                setOk("")
            }, 1500)
        } else {
            setError("Nie uzupełniono oczekiwanych pól")
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                {orderType.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:max-w-lg">
                        {toEditOrderType.length === 0 ? (
                            <div className="text-center">
                                <div className="text-2xl mb-4 text-yellow-600 font-semibold">Wybierz typ zamówienia</div>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setToEditOrderType("odbiór na miejscu")}
                                        className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition">
                                        Odbiór na miejscu
                                    </button>
                                    <button
                                        onClick={() => setToEditOrderType("dostawa do stolika")}
                                        className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition">
                                        Dostawa do stolika
                                    </button>
                                    <button
                                        onClick={handleDelvieryChoice}
                                        className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition">
                                        Dostawa do domu
                                    </button>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
                                    Anuluj
                                </button>
                            </div>
                        ) : (
                            <div>
                                {toEditOrderType === "odbiór na miejscu" && (
                                    <div className="text-center">
                                        <div className="text-xl mb-4">Wybierz w jaki sposób chcesz otrzymać zamówienie</div>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => handleDecision("na miejscu")}
                                                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition">
                                                Zjem na miejscu
                                            </button>
                                            <button
                                                onClick={() => handleDecision("na wynos")}
                                                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition">
                                                Wezmę na wynos
                                            </button>
                                        </div>
                                        {ok !== "" && <div className="text-green-500">{ok}</div>}
                                        <button
                                            onClick={() => setToEditOrderType("")}
                                            className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
                                            Wróć
                                        </button>
                                    </div>
                                )}
                                {toEditOrderType === "dostawa do stolika" && (
                                    <div className="text-center">
                                        <div className="text-xl mb-4 font-semibold text-yellow-600">
                                            Proszę podać numer stolika (maks 25):
                                        </div>
                                        <input
                                            placeholder="Tu wpisz numer stolika"
                                            type="number"
                                            onKeyDown={handleEnter}
                                            className="w-60 p-2 border rounded-md mb-4"
                                        />
                                        <div className="text-sm text-gray-600 underline">
                                            Zatwierdź klikając Enter!
                                        </div>
                                        {ok !== "" && <div className="text-green-500 mt-2">{ok}</div>}
                                        {error !== "" && <div className="text-red-500 mt-2">{error}</div>}
                                        <button
                                            onClick={() => setToEditOrderType("")}
                                            className="w-72 mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                                        >
                                            Wróć
                                        </button>
                                    </div>
                                )}
                                {toEditOrderType === "dostawa do domu" && (
                                    <div className="text-center">
                                        <div className="text-xl mb-6 font-semibold text-yellow-600">
                                            Twoje Dane:
                                        </div>

                                        <div className="mb-4">
                                            {delAdress !== "" ? (
                                                <div className="mb-4">
                                                    <div className="text-lg text-gray-800 font-medium break-words">Adres: <div className="font-bold">{delAdress}</div></div>
                                                    <div className="text-sm text-gray-600 mb-2">Jeśli chcesz zmienić adres, wpisz go poniżej:</div>
                                                    <input
                                                        placeholder="Adres zamieszkania, np. Warszawa, Marszałkowska 123/45"
                                                        type="text"
                                                        onKeyDown={(e) => handleEnterDel(e, "adress")}
                                                        className="w-full p-2 border rounded-md mb-4"
                                                    />
                                                    <div className="text-sm text-gray-500 underline text-left">
                                                        Zatwierdź klikając Enter!
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mb-4">
                                                    <div className="text-2xl text-red-600 font-bold mb-4">Nie podano adresu zamieszkania przy logowaniu!</div>
                                                    <div className="text-lg text-gray-600 mb-2">Proszę podać go teraz:</div>
                                                    <input
                                                        placeholder="Adres zamieszkania, np. Warszawa, Marszałkowska 123/45"
                                                        type="text"
                                                        onKeyDown={(e) => handleEnterDel(e, "adress")}
                                                        className="w-full p-2 border rounded-md mb-4"
                                                    />
                                                    <div className="text-sm text-gray-500 underline text-left">
                                                        Zatwierdź klikając Enter!
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            {phoneNr !== "" ? (
                                                <div>
                                                    <div className="text-lg text-gray-800 font-medium">Numer telefonu: <div className="font-bold">{phoneNr}</div></div>
                                                    <div className="text-sm text-gray-600 mb-2">Jeśli chcesz zmienić numer, wpisz go poniżej:</div>
                                                    <input
                                                        placeholder="Numer telefonu"
                                                        type="text"
                                                        onKeyDown={(e) => handleEnterDel(e, "phoneNr")}
                                                        className="w-full p-2 border rounded-md mb-4"
                                                    />
                                                    <div className="text-sm text-gray-500 underline text-left">
                                                        Zatwierdź klikając Enter!
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-2xl text-red-600 font-bold mb-4">Nie podano numeru telefonu przy logowaniu!</div>
                                                    <div className="text-lg text-gray-600 mb-2">Proszę podać go teraz, aby umożliwić kontakt z dostawcą:</div>
                                                    <input
                                                        placeholder="Numer telefonu"
                                                        type="text"
                                                        onKeyDown={(e) => handleEnterDel(e, "phoneNr")}
                                                        className="w-full p-2 border rounded-md mb-4"
                                                    />
                                                    <div className="text-sm text-gray-500 underline text-left">
                                                        Zatwierdź klikając Enter!
                                                    </div>
                                                    {error !== "" && <div className="text-red-500 mt-2">{error}</div>}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <button
                                                onClick={submitDelivery}
                                                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition mt-4">
                                                Zatwierdź
                                            </button>
                                            {ok && <div className="text-green-500 mt-2">{ok}</div>}
                                        </div>

                                        <button
                                            onClick={() => {
                                                setToEditOrderType("");
                                                setDelAdress("");
                                                setPhoneNr("");
                                                setError("");
                                            }}
                                            className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
                                            Wróć
                                        </button>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative">
                        <div className="mb-4 text-center text-2xl font-semibold text-yellow-800">
                            Kwota do zapłaty: <span className="text-3xl font-bold text-yellow-600">{price} zł</span>
                        </div>
                        <div className="text-sm sm:text-base text-gray-700">
                            <div className="mb-2 text-lg font-medium">Typ zamówienia:</div>
                            <div className="text-yellow-500 font-bold">{orderType}</div>
                            {orderType === "dostawa do domu" ? (
                                <div>
                                    <div className="text-yellow-700 text-xl">Adres: {orderDetails.split("|")[0]}</div>
                                    <div className="text-yellow-700 text-xl">Numer telefonu: {orderDetails.split("|")[1]}</div>
                                </div>
                            ) : (
                                <div className="break-words text-yellow-700 text-xl">{orderDetails}</div>
                            )}
                        </div>
                        <button
                            onClick={() => setOrderType("")}
                            className="w-1/2 mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition"
                        >
                            Zmień typ dostawy
                        </button>
                        <div className="flex flex-col items-center space-y-4 mt-6">
                            <button
                                onClick={handlePayment}
                                className="bg-yellow-500 w-1/2 text-white py-2 px-6 rounded-md hover:bg-yellow-600 transition-transform transform hover:scale-105 shadow-md"
                            >
                                Zapłać
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-red-500 w-1/2 text-white py-2 px-6 rounded-md hover:bg-red-600 transition shadow-md"
                            >
                                Anuluj
                            </button>
                        </div>

                        {isLoading && (
                            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
                                <div className="text-lg font-semibold text-yellow-800 text-center break-words">
                                    {info}
                                </div>
                            </div>
                        )}


                    </div>

                )}
            </div>
        </>
    );
}

