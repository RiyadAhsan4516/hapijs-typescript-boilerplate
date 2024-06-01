import {rename} from "fs";
import {badData, unsupportedMediaType} from "@hapi/boom";

export async function fileProcessor(
    uploaded_file: any,
    allowed_types: string[],
    file_size: number = 2000000,
    folder: string | null = null
): Promise<string> {
    if (!uploaded_file.headers) throw badData("if image is uploaded, then it must be a file")
    if (uploaded_file.bytes > file_size) throw badData("the uploaded file is too large!")
    let {fileType, filepath} = await checkFileTypeAndReturnPath(uploaded_file, allowed_types);
    let dest: string = await getUploadDestination(folder, filepath, uploaded_file, fileType)
    await rename(uploaded_file.path, dest, (err: NodeJS.ErrnoException | null): void => {
        if (err) {
            throw badData("Bad file was provided. Upload failed");
        }
    });
    return dest.split("public/")[1];
}


async function checkFileTypeAndReturnPath(uploaded_file: any, allowed_types: string[]): Promise<{ [key: string]: string }> {
    const file_type: string = uploaded_file.headers['content-type'].split("/")[1];
    const fileType: string = uploaded_file.filename.split(".")[1];
    if (!allowed_types.includes(file_type)) throw unsupportedMediaType("file type invalid");
    return {fileType, filepath: uploaded_file.path.split("/tmp")[0]}
}


async function getUploadDestination(folder: string | null, filepath: string, uploaded_file: any, fileType: string) : Promise<string> {
    if (folder) return `${filepath}/${folder}${uploaded_file.path.split("tmp")[1]}.${fileType}`
    else return `${filepath}${uploaded_file.path.split("tmp")[1]}.${fileType}`
}
