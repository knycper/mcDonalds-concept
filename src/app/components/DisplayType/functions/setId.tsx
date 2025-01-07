import { AllOrders } from "../../types/types"

export default function setId(order: AllOrders[]) {
    if (order.length === 0) {
        return "1"
    } else {
        const lastId = order[order.length - 1].id
        const newId = Number(lastId) + 1
        return `${newId}`
    }
}