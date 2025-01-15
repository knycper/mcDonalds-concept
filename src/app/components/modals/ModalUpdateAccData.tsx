type Data = {
    email: string;
    password: string;
    adress: string;
    phoneNumber: string
}

export default function ModalUpdateAccData({ onClose, onConfirm, data }: { onClose: () => void; onConfirm: (message: string) => void, data: Data }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <div className="text-lg font-semibold mb-4">Czy na pewno chcesz zaktualizować swoje dane?</div>
                <div>
                    <div>Zaktualizowane dane:</div>
                    <div>Email: </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => onConfirm(message)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Zatwierdź
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Anuluj
                    </button>
                </div>
            </div>
        </div>
    )
}