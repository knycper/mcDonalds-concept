import express from 'express';
import User from '../models/User.js';

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

        Object.assign(orderToUpdate, updated);

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
        console.log("jest zapytanie")
        const { email } = req.query

        console.log("email", email, "to jest email")

        const user = await User.findOne({ email })

        if (!user) return res.status(404).json({ message: "Wystąpił błąd. Spróbuj ponownie" })

        const order = user.order

        return res.status(200).json({ order })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Błąd serwera!" });
    }
})


export default router;