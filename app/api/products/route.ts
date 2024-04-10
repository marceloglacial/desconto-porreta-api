import clientPromise from "@/services/mongodb";

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
    const body = await request.json()
    await client.db(database).collection(collection).insertOne({ product: body });
    return Response.json({ message: "successfully updated the document" })
}
