import { readFile } from "fs/promises";

export const fromFileToList = async (): Promise<Array<string>> => {
    const file = await readFile("./songs d.txt", "utf-8");
    return file.split("\n");
};
