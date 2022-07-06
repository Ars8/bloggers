import {MongoClient} from 'mongodb'
import {BloggerDBType, PostDBType, UserDBType} from "./types"

const mongoUri = process.env.mongoUri || "mongodb://127.0.0.1:27017"

export const client = new MongoClient(mongoUri);

let db = client.db("social-net")

export const usersCollection = db.collection<UserDBType>('users')
export const bloggersCollection = db.collection<BloggerDBType>('bloggers')
export const postsCollection = db.collection<PostDBType>('posts')

export async function runDb() {
    try {
        await client.connect();
        await client.db("products").command({ping: 1});
        console.log("Connected successfuly to mongo server");
    } catch {
        console.log("Can't connect to DB");
        await client.close();
    }
}