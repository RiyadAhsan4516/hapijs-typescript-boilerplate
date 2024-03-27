import {rename} from "fs";
import {badData, unsupportedMediaType} from "@hapi/boom";

export async function fileProcessor(uploaded_file: any, allowed_types: string[], file_size: number = 2000000, folder: string | null = null): Promise<string> {
    // CHECK FILE HEADERS
    if (!uploaded_file.headers) throw badData("if image is uploaded, then it must be a file")

    // CHECK FILE SIZE
    if (uploaded_file.bytes > file_size) throw badData("the uploaded file is too large!")

    // CHECK THE FILE TYPE
    const file_type: string = uploaded_file.headers['content-type'].split("/")[1];
    const fileType: string = uploaded_file.filename.split(".")[1];
    if (!allowed_types.includes(file_type)) throw unsupportedMediaType("file type invalid");
    let filepath = uploaded_file.path.split("/tmp")[0];

    // SAVE THE FILE IN ITS CORRESPONDING FOLDER
    let dest: string
    if (folder) dest = `${filepath}/${folder}/${uploaded_file.path.split("tmp")[1]}.${fileType}`
    else dest = `${filepath}${uploaded_file.path.split("tmp")[1]}.${fileType}`

    await rename(uploaded_file.path, dest, (err: NodeJS.ErrnoException | null): void => {
        if (err) {
            throw badData("Bad file was provided. Upload failed");
        }
    });

    return dest.split("public")[1];
}

