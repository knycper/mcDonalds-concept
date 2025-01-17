export default function ModalLoading({ info, close }: { info?: string, close: () => void }) {
    return (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-500 border-b-4 mb-6"></div>
            <div className="text-lg font-semibold text-yellow-800 mb-4" aria-live="polite">
                {info || "Ładowanie..."}
            </div>
            <button
                onClick={close}
                className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
                Zamknij
            </button>
        </div>
    );
}
