/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation";
import OperationError from "../errors/OperationError";
import { isImage } from "../lib/FileType";
import { toBase64 } from "../lib/Base64";
import jimp from "jimp";
import { gaussianBlur } from "../lib/ImageManipulation";

/**
 * Blur Image operation
 */
class BlurImage extends Operation {

    /**
     * BlurImage constructor
     */
    constructor() {
        super();

        this.name = "Blur Image";
        this.module = "Image";
        this.description = "Applies a blur effect to the image.<br><br>Gaussian blur is much slower than fast blur, but produces better results.";
        this.infoURL = "https://wikipedia.org/wiki/Gaussian_blur";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "Amount",
                type: "number",
                value: 5,
                min: 1
            },
            {
                name: "Type",
                type: "option",
                value: ["Fast", "Gaussian"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        const [blurAmount, blurType] = args;

        if (!isImage(new Uint8Array(input))) {
            throw new OperationError("Invalid file type.");
        }

        let image;
        try {
            image = await jimp.read(input);
        } catch (err) {
            throw new OperationError(`Error loading image. (${err})`);
        }
        try {
            switch (blurType){
                case "Fast":
                    if (ENVIRONMENT_IS_WORKER())
                        self.sendStatusMessage("Fast blurring image...");
                    image.blur(blurAmount);
                    break;
                case "Gaussian":
                    if (ENVIRONMENT_IS_WORKER())
                        self.sendStatusMessage("Gaussian blurring image...");
                    image = gaussianBlur(image, blurAmount);
                    break;
            }

            let imageBuffer;
            if (image.getMIME() === "image/gif") {
                imageBuffer = await image.getBufferAsync(jimp.MIME_PNG);
            } else {
                imageBuffer = await image.getBufferAsync(jimp.AUTO);
            }
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`Error blurring image. (${err})`);
        }
    }

    /**
     * Displays the blurred image using HTML for web apps
     *
     * @param {ArrayBuffer} data
     * @returns {html}
     */
    present(data) {
        if (!data.byteLength) return "";
        const dataArray = new Uint8Array(data);

        const type = isImage(dataArray);
        if (!type) {
            throw new OperationError("Invalid file type.");
        }

        return `<img src="data:${type};base64,${toBase64(dataArray)}">`;
    }

}

export default BlurImage;
