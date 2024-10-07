export const DATABASE_NAME = process.env.DATABASE_NAME || 'production'
export const COLLECTIONS = {
    PAGES: 'pages',
    VENDORS: 'vendors',
    PRODUCTS: 'products',
    PARTNERS: 'partners'
}
export const AGGREGATIONS = {
    VENDORS: [
        {
            '$lookup': {
                'from': 'vendors',
                'localField': 'vendor',
                'foreignField': '_id',
                'as': 'vendor_info'
            },
        },
        { $sort: { _id: -1 } }
    ]
}

export const API_SETUP = {
    LIMIT: 100,
    PAGES: 1
}
