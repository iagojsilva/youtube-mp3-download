import { ID, MusicName } from "./youtube-downloader";
import cheerio, { CheerioAPI } from "cheerio";
import puppeteer from "puppeteer";

const _url = "https://youtube.com/"; // URL we're scraping

export interface SongMetadata {
    musicID: ID | undefined;
    musicName: MusicName;
}

const buildURL = (musicName: string): string =>
    `${_url}results?search_query=${musicName}`;

const extractID = (rawID: string | undefined): string | undefined => {
    if (rawID === undefined) return;
    const equalIndex = rawID.search("=");
    return rawID.slice(equalIndex + 1);
};

const setSongMetadata = ($: CheerioAPI): SongMetadata => {
    let songMetadata: any = {};
    $("#video-title").each((i, el) => {
        if (i !== 0) return;
        const musicName = $(el).text().trimStart().trimEnd();
        const href = extractID($(el).attr("href"));
        const musicID = href ? href.trimStart().trimEnd() : undefined;
        songMetadata = { musicID, musicName };
    });
    return songMetadata;
};

export const getDownloadInfo = async (
    songName: string
): Promise<SongMetadata> => {
    console.log(`getDownloadInfo == called with ${songName}`);
    const url = buildURL(songName);

    // Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.content();

    // Cheerio
    const $ = cheerio.load(html); // Load the HTML string into cheerio
    const songMetadata = setSongMetadata($);

    // Song metadata
    await browser.close();
    return songMetadata;
};
