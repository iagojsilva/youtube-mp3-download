import axios from "axios";
import cheerio, { CheerioAPI } from "cheerio";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { concatMap, delay, of, Subject } from "rxjs";
import { appendState, checkState } from "../../core/use-cases/song/state";
import { SongState, emptySongState } from "../../state/types";
import { inpureAppendState } from "./state/inpure-append-state";
import { inpureCheckState } from "./state/inpure-check-state";

const songsNameQueue$ = new Subject<SongState>();

const url = "https://www.vagalume.com.br/top100/albuns/nacional/2021/11/"; // URL we're scraping
const AxiosInstance = axios.create(); // Create a new Axios Instance

const getAlbumLinks = ($: CheerioAPI): Array<string> => {
  const albumLinks: Array<string> = [];
  $(".h22").each((_index, element) => {
    const href = $(element).attr("href");
    if (href === undefined) return;
    albumLinks.push(href);
  });
  return albumLinks;
};

const getAllSongs = async (albumLinks: Array<string>): Promise<void> => {
  const buildURL = (link: string): string => {
    return "https://www.vagalume.com.br" + link;
  };

  const getArtist = (link: string): string => {
    let artist = link.substring(1, link.length);
    const slashIndex = artist.search("/");
    artist = artist.substring(0, slashIndex);
    return artist;
  };

  albumLinks.map(async (path) => {
    // Build URL
    const url = buildURL(path);

    // Do a HTTP GET resquest to album URL
    const response = await AxiosInstance.get(url);

    // Get the HTML from the HTTP request
    const html = response.data;

    // Load the HTML on cheerio
    const $ = cheerio.load(html);

    // Get all songs from the album
    const songsName = $(".nameMusic");
    songsName.each((_index, element) => {
      // Build artist name
      const artist = getArtist(path);

      // Build the song name with artist name on it
      const fullMusicName = artist + " " + $(element).text();

      // Build the object to append to the state
      const songObject: SongState = {
        ...emptySongState,
        songName: fullMusicName,
      };
      songsNameQueue$.next(songObject);
    });
  });
};

export const inpureGetSongsName = async (): Promise<void> => {
  // Make a HTTP GET request
  const response = await AxiosInstance.get(url);

  // Get the HTML from the HTTP request
  const html = response.data;

  // Load the HTML string into cheerio
  const $ = cheerio.load(html);

  const albumLinks: Array<string> = getAlbumLinks($);
  await getAllSongs(albumLinks);
};

songsNameQueue$
  .pipe(
    concatMap(async (songObject) => {
      // Append to the state
      const isOnTheStateEither = await checkState(inpureCheckState)(songObject)(
        "songName"
      )();

      if (E.isRight(isOnTheStateEither)) {
        await appendState(inpureAppendState)(songObject)();
        return;
      }
      console.log(isOnTheStateEither.left.message);
      return of(isOnTheStateEither).pipe(delay(100));
    })
  )
  .subscribe();
