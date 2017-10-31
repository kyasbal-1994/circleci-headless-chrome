import BlinkDiff from "blink-diff";

export default class DiffMaker {
    public static async makeDiff(imageA: string, imageBURL: string): Promise<void> {
        const diff = new BlinkDiff({
            imageAPath: imageA,
            imageBPath: imageBURL,
            imageOutputPath: "diff.png"
        });
        await DiffMaker._runDiff(diff);
    }

    private static async _runDiff(diff: typeof BlinkDiff): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            diff.run((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(result);
                    resolve(result);
                }
            })
        });
    }
}