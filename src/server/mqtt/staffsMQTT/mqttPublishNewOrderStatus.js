import client from "./mqttClientStaff.js";

export default function publishNewOrderStatus(status, email, callback) {
    const ORDER_STATUS_UPDATE = "orderStatus/update"

    const statusMessage = JSON.stringify({ status, email })

    console.log("wysylany status do mqtt: ", status)

    console.log(JSON.parse(statusMessage), "cala wartosc statusMessage")

    client.publish(ORDER_STATUS_UPDATE, statusMessage, (err) => {
        if (err) {
            console.log("Napotkano błąd: ", err)
            callback(false, err)
        } else {
            console.log("Wysłano zamówienie!")
            callback(true, null)
        }
    })
}