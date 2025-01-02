import { ForYouOrder } from "../types/types";
import NormalOrderHist from "./HistoryNormalOrder";
import HistoryDrink from "./HistoryDrink"

interface HistoryForYouProps {
    forYouOrder: ForYouOrder;
}

export default function HistoryForYou({ forYouOrder }: HistoryForYouProps) {
    return (
        <div>
            <div>
                <NormalOrderHist order={forYouOrder.main} price={false} />
            </div>
            <div>
                {forYouOrder.second.drink ? (
                    <HistoryDrink drinkOrder={forYouOrder.second.drink} price={false} />
                ) : (
                    <div></div>
                )}
            </div>
            <div>{forYouOrder.price} zł</div>
        </div>
    )
}