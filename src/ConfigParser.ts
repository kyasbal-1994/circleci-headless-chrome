import IE2ETest from "./IE2ETest";
import * as fs from "fs";
import * as glob from "glob";
import * as yaml from "js-yaml";
import IE2ETestRecipe from "./IE2ETestRecipe";
const defaultConfig = {
    url: "",
    timeout: 100000,
    waitFor: null
} as IE2ETest;
export default class ConfigParser {

    public static async loadAll(): Promise<IE2ETest[]> {
        let result = {} as IE2ETestRecipe;
        const files = await this._fetchTestFiles("test/**/*.yml");
        let names = files.map(f => this._removeExt(f));
        await Promise.all(names.map(async (name, index) => {
            const tests = await this.loadFrom(files[index], name);
            result[name] = tests;
        }));
        console.log(result);
        let tests = [] as IE2ETest[];
        for (let resultKey in result) {
            result[resultKey].forEach((r) => tests.push(r));
        }
        console.log(tests);
        return tests;
    }

    public static async loadFrom(path: string, name: string): Promise<IE2ETest[]> {
        const raw = yaml.safeLoad(await this._loadText(path));
        for (let key in raw) {
            let data = raw[key];
            if (typeof data === "string") {
                data = raw[key] = {
                    url: data
                } as IE2ETest;
            }
            for (let paramName in defaultConfig) {
                if (data[paramName] === void 0) {
                    data[paramName] = defaultConfig[paramName];
                }
            }
            data.group = /test\/(.+)$/m.exec(name)[1];
            data.name = key;
        }
        return Object.keys(raw).map(k => raw[k]);
    }

    private static _loadText(file: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(file, "utf-8", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    private static _fetchTestFiles(file: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            ((glob as any).default as typeof glob)(file, (err, matches) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(matches);
                }
            });
        });
    }

    private static _removeExt(path: string): string {
        return /(.+).yml$/m.exec(path)[1];
    }
}