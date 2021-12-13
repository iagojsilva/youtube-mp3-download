import cheerio, { CheerioAPI } from "cheerio";
import puppeteer from "puppeteer";
import { SongState } from "../../state/types";

const _url = "https://youtube.com/"; // URL we're scraping

const buildURL = (musicName: string): string =>
  `${_url}results?search_query=${musicName}`;

const extractID = (rawID: string | undefined): string | undefined => {
  if (rawID === undefined) return;
  const equalIndex = rawID.search("=");
  return rawID.slice(equalIndex + 1);
};

const setSongState = async ($: CheerioAPI, song: SongState) => {
  $("#video-title").each((i, el) => {
    if (i !== 0) return;
    const href = extractID($(el).attr("href"));
    const musicID = href ? href.trimStart().trimEnd() : null;
    song.id = musicID;
    console.log(musicID);
  });
};

export const inpureGetSongInfo = async (song: SongState) => {
  console.log(`getDownloadInfo == called with ${song.songName}`);
  const url = buildURL(song.songName);

  // Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const html = await page.content();

  // Cheerio
  const $ = cheerio.load(html); // Load the HTML string into cheerio
  const isOnTheStateEither = await setSongState($, song);

  // Song metadata
  await browser.close();
};
