import clientPromise from "@/services/mongodb";

export async function GET(_request: Request, { params }: { params: { slug: string } }
) {
    const database = 'production'
    const collection = 'pages'
    const client = await clientPromise
    const slug = params.slug
    const query = { slug: slug };
    try {
        const coll = await client.db(database).collection(collection);
        const agg = [
            { $match: query },
            {
                '$lookup': {
                    from: slug,
                    pipeline: [],
                    as: 'items',
                },
            },
            { $sort: { _id: -1 } }
        ];
        const data = await coll.aggregate(agg).toArray();
        const singleData = data[0]
        console.log(singleData);

        const result: IResponse = {
            data: singleData,
            status: 'success',
            total: singleData.items.length,
            message: 'Success'
        }
        return Response.json(result)
    } catch (e) {
        const result: IResponse = {
            data: null,
            status: 'error',
            total: 0,
            message: 'Error loading the data'
        }
        return Response.json(result)
    }
}
