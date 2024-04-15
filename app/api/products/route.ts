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
        },
    },
    { $sort: { _id: -1 } }
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

    const newProduct = {
        ...body,
        vendor: ObjectId.createFromHexString(body.vendor)
    }

    const result = await client.db(database).collection(collection).insertOne(newProduct);
    const insertedId = result.insertedId;
    return Response.json({ message: "Successfully updated the document!", id: insertedId })
}


export async function PUT(request: Request) {
    const client = await clientPromise;
    const body = await request.json();

    const productId = body.id;
    delete body.id;

    const updatedProduct = {
        $set: { ...body, vendor: ObjectId.createFromHexString(body.vendor) }
    };

    const result = await client.db(database).collection(collection).updateOne(
        { _id: ObjectId.createFromHexString(productId) },
        updatedProduct
    );

    if (result.modifiedCount === 0) {
        return Response.json({ message: "Failed to update the document!" });
    }

    return Response.json({ message: "Successfully updated the document!", id: productId });
}
