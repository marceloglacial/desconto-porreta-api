import { COLLECTIONS, DATABASE_NAME } from '@/contants';
import clientPromise from "@/services/mongodb";
import { ObjectId } from 'mongodb';

const database = DATABASE_NAME
const collection = COLLECTIONS.PARTNERS

export async function GET(_request: Request, { params }: { params: { slug: string } }
) {
    try {
        const client = await clientPromise
        const slug = params.slug
        const query = { _id: new ObjectId(slug) };
        const data = await client.db(database).collection(collection).findOne(query);
        const result: IResponse = {
            data,
            status: 'success',
            message: 'Success'
        }
        return Response.json(result)
    } catch (e) {
        const result: IResponse = {
            data: null,
            status: 'error',
            message: 'Error: invalid page ID'
        }
        return Response.json(result)
    }
}

export async function DELETE(_request: Request, { params }: { params: { slug: string } }) {
    try {
        const client = await clientPromise
        const slug = params.slug
        const query = { _id: new ObjectId(slug) };
        const data = await client.db(database).collection(collection).deleteOne(query);
        const result: IResponse = {
            data,
            status: 'success',
            message: 'Page deleted'
        }
        return Response.json(result)
    } catch (e) {
        const result: IResponse = {
            data: null,
            status: 'error',
            message: 'Error: invalid page ID'
        }
        return Response.json(result)
    }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
    try {
        const client = await clientPromise;
        const body = await request.json();
        const productId = params.slug;
        delete body.id;

        const updatedDocument = {
            $set: { ...body }
        };

        const data = await client.db(database).collection(collection).updateOne(
            { _id: ObjectId.createFromHexString(productId) },
            updatedDocument
        );

        const result: IResponse = {
            data,
            status: 'success',
            message: 'Successfully updated the document!'
        }
        return Response.json(result)
    } catch (e) {
        const result: IResponse = {
            data: [],
            total: 0,
            status: 'error',
            message: 'Error to update the document'
        }
        return Response.json(result)
    }
}
