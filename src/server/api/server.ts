import express, {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User'
import connectDB from '../database';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

app.use(bodyParser.json());

connectDB()

app.post('/register', async (req: Request, res: Response) => {
    try {
        const {email, password, address, phoneNumber} = req.body
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "użytkownik z podanym e-mailem już istnieje!" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            address,
            phoneNumber,
        });

        await newUser.save()

        return res.status(201).json({ message: "Użytkownik zarejestrowany pomyślnie!" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Błąd serwera!" })
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

