import { SosOrder } from "../types/types"
import Image from "next/image";

interface HistorySosProps {
    sosOrder: SosOrder;
    price: boolean;
}

export default function HistorySos({ sosOrder, price }: HistorySosProps) {
    return (
        <div>
            <div>{sosOrder.name}</div>
            <Image src={sosOrder.imageUrl} alt={`${sosOrder.name} zdjęcie`} height={150} width={150} />
            {price === true && (
                <div>{sosOrder.price} zł</div>
            )}
        </div>
    )
}