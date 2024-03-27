import {badImplementation} from "@hapi/boom";
import {join} from "path";

let gm: any = require("gm").subClass({ imageMagick: '7+' });

export async function imageResizer(dimensions: {width: number, height: number}, path_to_file: string): Promise<string> {
    let original_path: string = join(__dirname,'/..', '/..', 'public', path_to_file)
    let file_type : string = original_path.split(".")[1];
    let relative_path : string = original_path.split(".")[0];
    await gm(original_path)
        .resize(dimensions.width, dimensions.height, '!')
        .write(`${relative_path}_thumb.${file_type}`, function (err: Error | null) : void {
            if (err) {
                throw badImplementation("Image resize failed")
            }
        });
    return `${relative_path}_thumb.${file_type}`.split("public")[1]
}
