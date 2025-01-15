interface ModalSuccessProps {
    message: string;
    hideModal: () => void;
}

export default function ModalSucces({ message, hideModal }: ModalSuccessProps) {
    return (
        <div className="fixed top-4 right-4 bg-green-100 text-green-800 p-4 rounded-lg shadow-lg w-80 flex justify-between items-center">
            <div className="text-sm">
                {message}
            </div>
            <button
                onClick={hideModal}
                className="text-green-500 font-bold hover:text-green-700 transition"
            >
                ×
            </button>
        </div>
    )
}