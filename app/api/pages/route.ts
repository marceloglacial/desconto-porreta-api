import clientPromise from "@/services/mongodb";

export async function GET(_request: Request) {
    const database = 'production'
    const collection = 'pages'
    const client = await clientPromise

    try {
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
