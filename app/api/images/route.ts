import { cloudinary } from '@/config/cloudinary';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { NextRequest, NextResponse } from "next/server";

type UploadResponse =
    { success: true; result?: UploadApiResponse } |
    { success: false; error: UploadApiErrorResponse };

const uploadToCloudinary = (
    fileUri: string, fileName: string): Promise<UploadResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload(fileUri, {
                invalidate: true,
                resource_type: "auto",
                filename_override: fileName,
                folder: "admin",
                use_filename: true,
            })
            .then((result) => {
                resolve({ success: true, result });
            })
            .catch((error) => {
                reject({ success: false, error });
            });
    });
};


export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    const fileBuffer = await file.arrayBuffer();

    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

    const res = await uploadToCloudinary(fileUri, file.name);

    if (res.success && res.result) {
        return NextResponse.json({
            message: "success", data: res.result
        });
    } else return NextResponse.json({ message: "failure" });
}
