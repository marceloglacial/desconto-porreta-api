import { COLLECTIONS, DATABASE_NAME } from '@/contants';
import clientPromise from "@/services/mongodb";

const database = DATABASE_NAME
const collection = COLLECTIONS.PAGES

export async function GET(_request: Request, { params }: { params: { slug: string } }
) {
    try {
        const client = await clientPromise
        const slug = params.slug
        const query = { slug: slug };
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
