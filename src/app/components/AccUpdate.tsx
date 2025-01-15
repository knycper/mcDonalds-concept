import { useState, ChangeEvent } from "react"
import ModalAsking from "./modals/ModalAsking"
import ModalError from "./modals/ModalError"
import ModalLoading from "./modals/ModalLoading";
import axios from "axios";

type Data = {
    email: string;
    adress: string;
    phoneNumber: string;
}

export default function AccUpdate({ email, adress, phoneNumber }: Data) {
    const [update, setUpdate] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<{
        email: string; adress: string; phoneNumber: string; password: string
    }>({ email, adress, phoneNumber, password: "" });
    const [showModal, setShowModal] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingInfo, setLoadingInfo] = useState<string>("")
    const startInfo = {
        email,
        adress,
        phoneNumber
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^(\+48\s?)?(\d{3}[-\s]?){2}\d{3}$/;

    function checkNum(passw: string): boolean {
        const hasNumber = /\d/.test(passw);
        return hasNumber
    }

    function checkBigLetter(passw: string): boolean {
        const hasUpperCase = /[A-Z]/.test(passw);
        return hasUpperCase
    }

    function checkEigth(passw: string): boolean {
        const hasEigth = passw.length >= 8 ? true : false
        return hasEigth
    }

    function apiUpdate(toUpdate: {
        email: string;
        adress: string;
        phoneNumber: string;
        password: string;
    }) {
        setShowModal(false)
        setLoading(true)
        setLoadingInfo("Ładowanie...")
        console.log(toUpdate.email, userInfo.email)
        const emailToUpdate = toUpdate.email !== startInfo.email ? toUpdate.email : undefined
        const adressToUpdate = toUpdate.adress !== startInfo.adress ? toUpdate.adress : undefined
        const phoneNumberToUpdate = toUpdate.phoneNumber !== startInfo.phoneNumber ? toUpdate.phoneNumber : undefined
        const passwordToUpdate = toUpdate.password !== "" ? toUpdate.password : undefined
        if (!emailToUpdate && !adressToUpdate && !phoneNumberToUpdate && !passwordToUpdate) {
            setLoadingInfo("Nie dokonano żadnych zmian!")
        } else {
            const objectToUpdate = {
                mailToCheck: email,
                email: emailToUpdate,
                password: passwordToUpdate,
                adress: adressToUpdate,
                phoneNumber: phoneNumberToUpdate
            }
            axios.put('http://localhost:3001/update', objectToUpdate)
                .then(res => {
                    console.log("dostalem odpowiedz", res.data.message)
                    localStorage.setItem("activeUser", JSON.stringify({ email: userInfo.email, adress: userInfo.adress, phoneNumber: userInfo.phoneNumber }))
                    setLoadingInfo(res.data.message)
                    setTimeout(() => {
                        setLoading(false)
                    }, 1500)
                })
                .catch(error => {
                    const message = error.response?.data?.message || "Błąd połączenia z serwerem";
                    console.log(message);
                    setLoadingInfo(message);
                })
        }

    }

    function confirm() {
        let isError = false
        const toUpdate = {
            email: "",
            adress: "",
            phoneNumber: "",
            password: ""
        }
        if (userInfo.email !== email) {
            if (emailRegex.test(userInfo.email)) {
                toUpdate.email = userInfo.email
            } else {
                setError("Podano nie poprawny email. Spróbuj jeszcze raz!")
                isError = true
                setShowModal(false)
            }
        }
        if (userInfo.adress !== adress) {
            toUpdate.adress = userInfo.adress
        }
        if (userInfo.phoneNumber !== phoneNumber) {
            if (phoneRegex.test(userInfo.phoneNumber)) {
                toUpdate.phoneNumber = userInfo.phoneNumber
            } else {
                setError("Podano nie poprawny numer telefonu. Spróbuj jescze raz!")
                isError = true
                setShowModal(false)
            }
        }
        console.log("przed sprawdzeniem zmian w password")
        if (userInfo.password !== "") {
            const passw = userInfo.password
            if (checkBigLetter(passw) && checkEigth(passw) && checkNum(passw)) {
                toUpdate.password = passw
            } else {
                isError = true
                setError("Podane hasło nie zawiera podanych wymogów")
                setUserInfo({ ...userInfo, password: "" })
            }
        }

        if (!isError) {
            apiUpdate(toUpdate)
        } else {
            setShowModal(false)
        }

    }

    return (
        <div className="p-6 text-gray-800 flex items-center justify-center">
            {update ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-yellow-600 font-semibold">Email:</label>
                        <input
                            className="w-full p-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            value={userInfo.email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setUserInfo({ ...userInfo, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-yellow-600 font-semibold">Adres:</label>
                        <input
                            className="w-full p-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            value={userInfo.adress}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setUserInfo({ ...userInfo, adress: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-yellow-600 font-semibold">Numer telefonu:</label>
                        <input
                            className="w-full p-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            value={userInfo.phoneNumber}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setUserInfo({ ...userInfo, phoneNumber: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-yellow-600 font-semibold">Jeśli chcesz zmienic swoje hasło, wpisz je tutaj:</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            value={userInfo.password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setUserInfo({ ...userInfo, password: e.target.value })}
                        />
                        <p className="block text-yellow-600 font-bold underline">
                            Hasło musi zawierać:
                        </p>
                        <ul className="text-yellow-600 font-semibold">
                            <li>Conajmniej 8 liter</li>
                            <li>Conajmniej jedną wielką literę</li>
                            <li>Conajmniej jedną liczbę</li>
                        </ul>
                    </div>
                    <button
                        className="w-full py-2 bg-yellow-700 text-white font-semibold rounded-md hover:bg-yellow-600"
                        onClick={() => setShowModal(true)}
                    >
                        Zatwierdź zmiany
                    </button>
                    <button
                        className="w-full py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-400"
                        onClick={() => setUpdate(false)}
                    >
                        Wróć
                    </button>

                </div>
            ) : (
                <div className="space-y-4">
                    <div className="text-yellow-600 font-semibold">Email: <span className="text-gray-800">{email}</span></div>
                    <div className="text-yellow-600 font-semibold">Adres: <span className="text-gray-800">{adress}</span></div>
                    <div className="text-yellow-600 font-semibold">Numer telefonu: <span className="text-gray-800">{phoneNumber}</span></div>
                    <button
                        className="w-full py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-500"
                        onClick={() => setUpdate(true)}
                    >
                        Aktualizuj dane
                    </button>
                </div>
            )}
            {showModal && (
                <ModalAsking onClose={() => setShowModal(false)} onConfirm={confirm} message="update" />
            )}
            {error !== "" && (
                <ModalError error={error} hideModal={() => setError("")} />
            )}
            {loading && (
                <ModalLoading info={loadingInfo} close={() => setLoading(false)} />
            )}
        </div>
    );

}