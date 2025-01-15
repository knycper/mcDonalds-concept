'use client'

import { useState } from "react"
import axios from "axios"
import { useRouter } from 'next/navigation';

export default function ModalDelete({ email, back }: { email: string, back: () => void }) {
    const [accepted, setAccepted] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [done, setDone] = useState<string>("")

    const router = useRouter()

    function deleteAcc() {
        if (password !== "") {
            const data = {
                email,
                password
            }
            axios.delete('http://localhost:3001/delete', { data })
                .then(res => {
                    setError("")
                    setDone(res.data.message + ". Teraz wrócisz do ekranu logowania")
                    setTimeout(() => {
                        localStorage.removeItem("activeUser")
                        router.push("/")
                    }, 2000)
                })
                .catch(error => {
                    setError(error.response.data.message)
                })
        } else {
            setError("nie podano hasła")
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:max-w-lg">
                    {accepted ? (
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-yellow-600 mb-4">
                                Podaj swoje hasło, aby potwierdzić usunięcie konta
                            </h2>
                            <input
                                placeholder="Hasło"
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-2 border-yellow-400 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            />
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={deleteAcc}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                                >
                                    Zatwierdź
                                </button>
                                <button
                                    onClick={back}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                                >
                                    Anuluj
                                </button>
                            </div>
                            {error && (
                                <div className="mt-4 text-red-600 font-medium">
                                    {error}
                                </div>
                            )}
                            {done && (
                                <div className="mt-4 text-green-600 font-medium">
                                    {done}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-yellow-600 mb-4">
                                Czy na pewno chcesz usunąć konto?
                            </h2>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setAccepted(true)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                                >
                                    Usuń
                                </button>
                                <button
                                    onClick={back}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                                >
                                    Anuluj
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

}