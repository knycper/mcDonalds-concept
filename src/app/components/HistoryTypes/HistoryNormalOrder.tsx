import Image from "next/image"
import { NormalOrder } from "../types/types"

interface HistoryNormalOrderProps {
    order: NormalOrder
    price: boolean
}

export default function HistoryNormalOrder({ order, price }: HistoryNormalOrderProps) {
    return (
        <div>
            <div>{order.name}</div>
            <Image src={order.imageUrl} alt={`${order.name} zdjęcie`} height={150} width={150} />

            {order.add.length !== 0 && (
                <div>
                    <ul>Dodatki:
                        {order.add.map((obj: string, i: number) => (
                            <li key={i}>{obj}</li>
                        ))}
                    </ul>
                </div>
            )}

            {order.del.length !== 0 && (
                <div>
                    <ul>Bez:
                        {order.del.map((obj: string, i: number) => (
                            <li key={i}>{obj}</li>
                        ))}
                    </ul>
                </div>
            )}
            {price === true && (
                <div>{order.price} zł</div>
            )}
        </div>
    )
}