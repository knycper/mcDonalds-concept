import client from "./mqttClientUser.js";


export default function sendOrder(order, callback) {
    const NEW_ORDER_TOPIC = "orders/new"
    const orderMessage = JSON.stringify(order)

    client.publish(NEW_ORDER_TOPIC, orderMessage, (err) => {
        if (err) {
            console.log("Napotkano błąd: ", err)
            callback(false, err)
        } else {
            console.log("Wysłano zamówienie!")
            callback(true, null)
        }
    })
}
