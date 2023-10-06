import * as dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from "mongodb";
import obj from "mongodb"

const MongoURL=MONGO_CONNECT_URL;

async function createConnection(){
    const client = new MongoClient(MongoURL)
    await client.connect()
    console.log("Mongodb connected successfully");
    return client;
}

export var ObjectId=obj.ObjectId;
export const client=await createConnection();