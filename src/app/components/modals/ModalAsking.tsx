export default function ModalAsking({ onClose, onConfirm, message }: { onClose: () => void; onConfirm: (message: string) => void, message: string }) {

    function Base({ info }: { info: string }) {
        return (
            <div>
                <div className="text-lg font-semibold mb-4">{info}</div>
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
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                {message === "logOut" ? (
                    <Base info="Czy na pewno chcesz się wylogować?" />
                ) : message === "update" ? (
                    <Base info="Czy na pewno chcesz zmienić swoje dane?" />
                ) : (
                    <div>
                        <div className="text-lg font-semibold mb-4">{message}</div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => onConfirm(message)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Potwierdź
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Anuluj
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}