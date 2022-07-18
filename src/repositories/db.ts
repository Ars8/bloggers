import {MongoClient} from 'mongodb'
import {BloggerDBType, CommentDBType, PostDBType, UserAccountDBType, UserDBType} from "./types"

const mongoUri = process.env.mongoUri || "mongodb://127.0.0.1:27017"

export const client = new MongoClient(mongoUri);

export let db = client.db("social-net")

export const usersCollection = db.collection<UserAccountDBType>('users')
export const bloggersCollection = db.collection<BloggerDBType>('bloggers')
export const postsCollection = db.collection<PostDBType>('posts')
export const commentsCollection = db.collection<CommentDBType>('comments')

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