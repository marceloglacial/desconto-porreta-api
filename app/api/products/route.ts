import clientPromise from "@/services/mongodb";
import { ObjectId } from 'mongodb';

const database = 'production'
const collection = 'products'
const agg = [
    {
        '$lookup': {
            'from': 'vendors',
            'localField': 'vendor',
            'foreignField': '_id',
            'as': 'vendor_info'
        }
    }
];

export async function GET(_request: Request) {
    const client = await clientPromise
    const coll = await client.db(database).collection(collection);
    const cursor = coll.aggregate(agg);
    const products = (await cursor.toArray())
    return Response.json(products)
}

export async function POST(request: Request) {
    const client = await clientPromise;
    try {
        const body = await request.json()
        const result = {
            ...body,
            vendor: ObjectId.createFromHexString(body.vendor)
        }

        await client.db(database).collection(collection).insertOne(result);
        const insertedId = result.insertedId;
        return Response.json({ message: "successfully updated the document", id: insertedId })

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close(); // Close the connection
    }
}
