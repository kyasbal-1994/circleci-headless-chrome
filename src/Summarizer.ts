import * as gm from "gm";
export default function Summarize(col: number, images: string[], fileName: string) {
    let image = gm(0, 0, "transparent");
    let current = 0;
    while (current < images.length) {
        for (let c = 0; c < col; c++) {
            image = image.append(images[current], c !== 0)
            current++;
        }
    }
    return new Promise((resolve, reject) => {
        image.write(fileName, (err, out) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(out);
        })
    });
}