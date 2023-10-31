import {rename} from "fs";
import {badData} from "@hapi/boom";

export async function fileProcessor(uploaded_file: any): Promise<string> {
    const fileType : string = uploaded_file.headers['content-type'].split("/")[1];
    const dest: string = `public${uploaded_file.path.split("tmp")[1]}.${fileType}`
    rename(uploaded_file.path, dest, (err: NodeJS.ErrnoException | null) => {
        if (err) throw badData("Bad file was provided. Upload failed");
    });
    return dest.split("public")[1];
}
