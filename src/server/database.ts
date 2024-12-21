import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://kacperlukowicz:<db_password>@cluster0.hnedr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

export default async function connectDB(): Promise<boolean> {
    try {
        await client.connect()
        console.log("connected to mongo")
        return true
    } catch (error) {
        console.log("Error connecting to database:", error)
        return false
    }
}
