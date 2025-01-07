export default function Modal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <div className="text-xl text-center mb-4 font-semibold text-gray-700">
                    Czy na pewno chcesz usunąć ten napój?
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={onConfirm}
                        className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition"
                    >
                        Usuń
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                    >
                        Anuluj
                    </button>
                </div>
            </div>
        </div>
    );
}