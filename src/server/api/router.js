import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';

import readMenu from '../../menu/readMenu.js'

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password, adress, phoneNumber } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "użytkownik z podanym e-mailem już istnieje! Spróbuj się zalogować" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            id: uuidv4(),
            email,
            password: hashedPassword,
            adress,
            phoneNumber,
        });

        await newUser.save();
        return res.status(201).json({ message: "Użytkownik zarejestrowany pomyślnie!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Błąd serwera!" });
    }
});

router.post('/check', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "Niepoprawny e-mail! Spróbuj jeszcze raz" })
        }
        const isPasswordOkay = await bcrypt.compare(password, user.password)

        if (!isPasswordOkay) {
            return res.status(401).json({ message: "Niepoprawne hasło! Spróbuj jeszcze raz" })
        }

        const { phoneNumber, adress } = user

        return res.status(200).json({ message: "Zalogowano Pomyślnie", 
            user: {
                email,
                adress,
                phoneNumber
            } })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Błąd serwera!" })
    }
})

router.get('/file', (req, res) => {
    const data = readMenu()
    return res.status(200).json({ message: data })
})

export default router;
