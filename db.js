import { MongoClient } from "mongodb";
import obj from "mongodb"
import * as dotenv from 'dotenv';

const MongoURL="mongodb+srv://venkat:venkat457@cluster0.gi4hbxg.mongodb.net/mern-pizza"

async function createConnection(){
    const client = new MongoClient(MongoURL)
    await client.connect()
    console.log("Mongodb connected successfully");
    return client;
}

export var ObjectId=obj.ObjectId;
export const client=await createConnection();