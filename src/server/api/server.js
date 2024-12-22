import express from 'express';
import cors from 'cors';
import connectDB from '../database.js';
import userRoutes from '../api/router.js';

const app = express();
const port = 3001;

(async () => {
    try {
        await connectDB();
        console.log("Połączono z bazą danych");
    } catch (error) {
        console.error("Nie można połączyć się z bazą danych:", error.message);
        process.exit(1);
    }
})();

app.use(express.json());

app.use(cors())

app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
