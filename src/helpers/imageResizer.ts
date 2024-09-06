import {badImplementation} from "@hapi/boom";
import {join} from "path";

let gm: any = require("gm").subClass({imageMagick: true});

export async function imageResizer(
    dimensions: { width: number, height: number } = {width: 100, height: 100},
    path_to_file: string,
    resize_folder: string = "/thumbnail/"
): Promise<void> {

    // STEP 1 : GET THE ORIGINAL FILE PATH AND THEN CREATE THE THUMBNAIL FILE PATH
    let original_path: string = join(__dirname, '/..', '/..', 'public', path_to_file)
    let relative_path: string = original_path.replace("/original/", resize_folder)

    // STEP 2 : RESIZE AND TWEAK THE IMAGE
    await gm(original_path)
        .resize(dimensions.width, dimensions.height, '!')
        .write(`${relative_path}`, function (err: Error | null): void {
            if (err) {
                throw badImplementation("Image resize failed")
            }
        })
}
