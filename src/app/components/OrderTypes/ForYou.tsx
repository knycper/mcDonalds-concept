import { ForYouOrder } from "../types/types";
import NormalOrderHist from "./NormalOrder";
import HistoryDrink from "./Drink"

interface HistoryForYouProps {
    forYouOrder: ForYouOrder;
}

export default function ForYou({ forYouOrder }: HistoryForYouProps) {
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