import { ForYouOrder } from "../types/types";
import NormalOrder from "./NormalOrder";
import HistoryDrink from "./Drink"

interface HistoryForYouProps {
    forYouOrder: ForYouOrder;
}

export default function ForYou({ forYouOrder }: HistoryForYouProps) {
    return (
        <div>
            <div>
                <NormalOrder order={forYouOrder.main} price={false} />
            </div>
            <div>
                {forYouOrder.second.drink ? (
                    <HistoryDrink drinkOrder={forYouOrder.second.drink} price={false} />
                ) : (
                    <NormalOrder order={forYouOrder.second.fries} price={false} />
                )}
            </div>
            <div>{forYouOrder.price} zł</div>
        </div>
    )
}