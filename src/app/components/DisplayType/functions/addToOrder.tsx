import { AllOrders } from "../../types/types";

export default function addToOrder(order: AllOrders[]) {
    if (order.length > 0) {
        localStorage.setItem("order", JSON.stringify(order));
    }
}