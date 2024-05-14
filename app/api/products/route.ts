import { AGGREGATIONS, COLLECTIONS, DATABASE_NAME } from '@/contants';
import clientPromise from "@/services/mongodb";
import { ObjectId } from 'mongodb';

const database = DATABASE_NAME
const collection = COLLECTIONS.PRODUCTS

export async function GET(request: Request) {
    try {
        const queryParams = new URL(request.url).searchParams;
        const page = parseInt(queryParams.get('page') || '1', 10);
        const limit = parseInt(queryParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;

        const client = await clientPromise;
        const coll = await client.db(database).collection(collection);

        const agg = [...AGGREGATIONS.PRODUCTS];
        // @ts-ignore
        agg.push({ $skip: skip }, { $limit: limit });

        const cursor = coll.aggregate(agg);
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
            data: null,
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
        const bodyWithVendor = {
            ...body,
            vendor: ObjectId.createFromHexString(body.vendor)
        }

        const data = await client.db(database).collection(collection).insertOne(bodyWithVendor);
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
