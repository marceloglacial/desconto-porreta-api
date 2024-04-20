interface ApiProduct {
    _id: string;
    title: string;
    description: string;
    image: ApiImage;
    link: string;
    price: ApiPrice;
    vendor: string;
    vendor_info: ApiVendor[];
}

interface ApiImage {
    src: string;
    alt: string;
    width?: number;
    height?: number;
}

interface ApiPrice {
    regular: number;
    discount?: number;
}

interface ApiVendor {
    _id: string;
    title: string;
    slug: string;
    logo: string;
}
interface IResponse {
    data: any,
    status: StatusType,
    message: string,
    total: number
}

type StatusType = 'success' | 'error'

type PageType = {
    _id: string,
    slug: string,
    title: string
}
