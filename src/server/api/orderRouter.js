import express from 'express';
import User from '../models/User.js';
import sendOrder from '../mqtt/usersMQTT/mqttPublishOrder.js';
import publishNewOrderStatus from "../mqtt/staffsMQTT/mqttPublishNewOrderStatus.js"

const router = express.Router();

router.post('/add', async (req, res) => {
    try {
        const { order, email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Wystąpił błąd. Spróbuj ponownie" });

        user.order.push(order);

        await user.save();

        return res.status(200).json({ message: "Dodano do zamówienia!" });

    } catch (error) {
        console.log("nie dzialam blad")
        console.log(error)
        return res.status(500).json({ message: "Błąd serwera!" });
    }
})

router.put('/updateOrder', async (req, res) => {
    try {
        const { orderId, email, updated } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Wystąpił błąd. Spróbuj ponownie" });

        const orderToUpdate = user.order.find(order => order.id === orderId);

        console.log("Wysłane: ", updated)

        console.log("Przed zaktualizowaniem: ", orderToUpdate)

        Object.assign(orderToUpdate, updated);

        console.log("Po aktualizacji: ", user.order.find(order => order.id === orderId))

        await user.save();

        return res.status(200).json({ message: "Zaktualizowano zamówienie!" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Błąd serwera!" });
    }
})

router.delete('/deleteOrder', async (req, res) => {
    try {
        const { email, id } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "Wystąpił błąd. Spróbuj ponownie" })

        const orderIndex = user.order.findIndex(order => order.id === id);

        user.order.splice(orderIndex, 1);

        await user.save();

        return res.status(200).json({ message: "Usunięto z zamówienia!" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Błąd serwera!" });
    }
})

router.get('/order', async (req, res) => {
    try {
        const { email } = req.query

        const user = await User.findOne({ email })

        if (!user) return res.status(404).json({ message: "Wystąpił błąd. Spróbuj ponownie" })

        const order = user.order

        return res.status(200).json({ order })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Błąd serwera!" });
    }
})

router.post('/publishedOrder', async (req, res) => {
    try {
        console.log("dostalem publish order")
        const { email, orderType, orderDetails } = req.body
        const user = await User.findOne({ email })

        if (!user) return res.status(404).json({ message: "Wystąpił błąd. Spróbuj ponownie" })

        const order = user.order

        const orderData = {
            order,
            orderType,
            orderDetails,
            email
        }

        sendOrder(orderData, async (succes, info) => {
            if (succes) {
                console.log("wyslano do mqtt")

                user.history.push(order)

                user.orderStatus.status = "In progress"

                user.order = []

                await user.save()

                return res.status(200).json({ message: "Wysłano zamówienie!" })
            } else {
                console.log("blad: ", info)
                return res.status(404).json({ message: "Wystąpił błąd w wysyłaniu mqtt" })
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Błąd serwera!" });
    }
})

router.post('/publishedOrder/update', async (req, res) => {
    try {
        const { email, status } = req.body
        console.log(status, "status w axios")

        const user = await User.findOne({ email })

        if (!user) return res.status(404).json({ message: "Wystąpił błąd spróbuj ponownie" })

        console.log("znaleziono uzytkownika")

        publishNewOrderStatus(status, email, async (succes, errorMess) => {
            if (succes) {
                user.orderStatus.status = status
                user.orderStatus.orderTime = null
                user.orderStatus.estimatedTime = null
                await user.save()
                return res.status(200).json({ message: "Zaktualizowano status pomyślnie" })
            } else {
                return res.status(500).json({ message: "Wystąpił błąd", error: errorMess })
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Błąd serwera!" });
    }

})

router.post('/reveivedOrder', async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })

        if (!user) return res.status(404).json({ message: "Wystąpił błąd spróbuj ponownie" })

        user.orderStatus.status = "None";
        user.orderStatus.orderTime = null;
        user.orderStatus.estimatedTime = null;

        await user.save()

        return res.status(200).json({ message: "Zaktualizowano status!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Błąd serwera!" });
    }
})

router.post('/timeUpdate', async (req, res) => {
    try {
        const { email, orderTime, estimatedTime } = req.body

        const user = await User.findOne({ email })

        if (!user) return res.status(404).json({ message: "Wystąpił błąd spróbuj ponownie" })

        user.orderStatus.orderTime = orderTime
        user.orderStatus.estimatedTime = estimatedTime

        await user.save()

        const orderFullStatus = user.orderStatus
        console.log("zaktualizowany orderStatus: ", orderFullStatus)

        return res.status(200).json({ message: "Zaktualizowano czas zamówienia!", orderStatus: orderFullStatus })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Błąd serwera!" });
    }
})

router.post('/deletedReaction', async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email })

        if (!user) return res.status(404).json({ message: "Wystąpił błąd spróbuj ponownie" })

        user.orderStatus.status = "None"
        user.orderStatus.orderTime = null
        user.orderStatus.estimatedTime = null

        await user.save()

        return res.status(200).json({ message: "Poprawnie zaktualizowano bazę" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Błąd serwera!" });
    }

})

export default router;