import Link from "next/link"

export default function Konto() {
    return (
        <div>
            <Link
            href={"/home/konto/info"}
            >Informacje o Koncie
            </Link>
        </div>
    )
}