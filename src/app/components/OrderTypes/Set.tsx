import Image from "next/image";
import { SetOrder } from "../types/types";
import NormalOrderHist from "./NormalOrder";
import HistoryDrink from "./Drink";

interface HistorySetProps {
    setOrder: SetOrder;
}

export default function Set({ setOrder }: HistorySetProps) {
    return (
        <div>
            <div>
                <NormalOrderHist order={setOrder.main} price={false} />
            </div>
            <div>
                <div>{setOrder.second.name}</div>
                <Image src={setOrder.second.imageUrl} alt={`${setOrder.second.name} zdjęcie`} height={150} width={150} />
            </div>

            <div>
                <HistoryDrink drinkOrder={setOrder.drink} price={false} />
            </div>
            <div>Cena: {setOrder.price} zł</div>
        </div>
    );
}
