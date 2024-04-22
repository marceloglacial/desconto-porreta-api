import { COLLECTIONS, DATABASE_NAME } from '@/contants';
import clientPromise from "@/services/mongodb";

const database = DATABASE_NAME
const collection = COLLECTIONS.PAGES

export async function GET(_request: Request) {
    try {
        const client = await clientPromise
        const cursor = await client.db(database).collection(collection).find();
        const data = await cursor.toArray()
        const result: IResponse = {
            data: data,
            total: data.length,
            status: 'success',
            message: 'Success'
        }
        return Response.json(result)
    } catch (e) {
        const result: IResponse = {
            data: [],
            total: 0,
            status: 'error',
            message: 'Error'
        }
        return Response.json(result)
    }
}

export async function POST(request: Request) {
    try {
        const client = await clientPromise;
        const body = await request.json()
        const data = await client.db(database).collection(collection).insertOne(body);
        const insertedId = data.insertedId;
        const result: IResponse = {
            data: insertedId,
            status: 'success',
            message: 'Successfully created the document!'
        }
        return Response.json(result)
    } catch (e) {
        const result: IResponse = {
            data: [],
            total: 0,
            status: 'error',
            message: 'Error to create the document'
        }
        return Response.json(result)
    }
}
