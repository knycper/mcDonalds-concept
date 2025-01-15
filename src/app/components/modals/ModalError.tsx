interface ModalErrorProps {
    error: string;
    hideModal: () => void;
}

export default function ModalError({ error, hideModal }: ModalErrorProps) {
    return (
        <div className="fixed top-4 right-4 bg-red-100 text-red-800 p-4 rounded-lg shadow-lg w-80 flex justify-between items-center">
            <div className="text-sm">
                {error}
            </div>
            <button
                onClick={hideModal}
                className="text-red-500 font-bold hover:text-red-700 transition"
            >
                ×
            </button>
        </div>
    )
}