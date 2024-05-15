import { API_SETUP, COLLECTIONS, DATABASE_NAME } from '@/contants';
import clientPromise from "@/services/mongodb";

const database = DATABASE_NAME
const collection = COLLECTIONS.VENDORS

export async function GET(request: Request) {
    try {
        const queryParams = new URL(request.url).searchParams;
        const page = parseInt(queryParams.get('page') || API_SETUP.PAGES.toString(), 10);
        const limit = parseInt(queryParams.get('limit') || API_SETUP.LIMIT.toString(), 10);
        const skip = (page - 1) * limit;

        const client = await clientPromise;
        const coll = client.db(database).collection(collection);

        const cursor = coll.find().sort({ title: 1 }).skip(skip).limit(limit);
        const data = await cursor.toArray();

        const totalCount = await coll.countDocuments();

        const result: IResponse = {
            data: data,
            total: totalCount,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalCount / limit),
            status: 'success',
            message: 'Success'
        };
        return Response.json(result);
    } catch (e) {
        console.error(e);
        const result: IResponse = {
            data: [],
            total: 0,
            status: 'error',
            message: 'Error'
        };
        return Response.json(result);
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
