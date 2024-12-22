import mongoose from 'mongoose';

const uri = "mongodb+srv://kacperlukowicz:Lechia2004@cluster0.hnedr.mongodb.net/protokoly?retryWrites=true&w=majority";  // Upewnij się, że masz poprawny URI

export default async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log("Połączono z MongoDB!");
    } catch (error) {
        console.error("Błąd połączenia z MongoDB:", error.message);
        process.exit(1);
    }
}
