'use client'

import { useState, useEffect } from "react"
import LeftAccPage from "./LeftAccPage"
import { useRouter } from 'next/navigation';
import ModalAsking from "./modals/ModalAsking";
import ModalError from "./modals/ModalError";
import AccUpdate from "./AccUpdate";
import ModalDelete from "./modals/ModalDelete";

type AccData = {
    email: string;
    adress: string;
    phoneNumber: string;
}

export default function AccPage() {
    const [accData, setAccData] = useState<AccData | null>(null)
    const [error, setError] = useState<string>("")
    const [modal, setModal] = useState<string>("")
    const [showData, setShowData] = useState<boolean>(false)
    const [removeAcc, setRemoveAcc] = useState<boolean>(false)

    const router = useRouter()

    useEffect(() => {
        const user = localStorage.getItem("activeUser")
        if (user) {
            const usr = JSON.parse(user)
            setAccData(usr)
        } else {
            setError("Wystąpił błąd. Spróbuj zalogować się ponownie")
        }
    }, [])

    function logOut() {
        setModal("logOut")
    }


    function closeModal() {
        setModal("")
    }

    function confirmModal(message: string) {
        if (message === "logOut") {
            localStorage.removeItem('activeUser')
            router.push('/')
        }
    }

    function showAccData() {
        setShowData(prev => !prev)
    }

    if (!accData) {
        return <div>Loading...</div>
    }

    function back() {
        setRemoveAcc(false)
    }

    return (
        <div className="bg-yellow-50 h-screen flex flex-col items-center justify-between">
            {showData ? (
                <div className="w-full">
                    <div className="flex items-center justify-center mt-4">
                        <LeftAccPage logOut={logOut} accData={showAccData} />
                    </div>
                    <div className="flex items-center justify-center">
                        {showData && (
                            <AccUpdate email={accData?.email} adress={accData.adress} phoneNumber={accData.phoneNumber} />
                        )}
                        {error !== "" && (
                            <ModalError error={error} hideModal={() => setError("")} />
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    <LeftAccPage logOut={logOut} accData={showAccData} deleteAcc={() => setRemoveAcc(true)} />
                </div>
            )}
            {modal !== "" && (
                <ModalAsking onClose={closeModal} onConfirm={confirmModal} message={modal} />
            )}
            {removeAcc && (
                <ModalDelete email={accData.email} back={back} />
            )}
        </div>
    )
}