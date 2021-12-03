import axios from "axios";
import cheerio, { Cheerio, CheerioAPI } from "cheerio";
import { createWriteStream } from "fs";
import { writeFile } from "fs/promises";

const url = "https://www.vagalume.com.br/top100/albuns/"; // URL we're scraping
const AxiosInstance = axios.create(); // Create a new Axios Instance

const stream = createWriteStream("songs.txt", { flags: "a" });

type SongInfo = Array<string>;

const getAlbumLinks = ($: CheerioAPI): Array<string> => {
    const albumLinks: Array<string> = [];
    $(".h22").each((_index, element) => {
        const href = $(element).attr("href");
        if (href === undefined) return;
        albumLinks.push(href);
    });
    return albumLinks;
};

const getAllSongs = async (albumLinks: Array<string>): Promise<SongInfo> => {
    const getArtist = (link: string): string => {
        let artist = link.substring(1, link.length);
        const slashIndex = artist.search("/");
        artist = artist.substring(0, slashIndex);
        return artist;
    };

    const buildURL = (link: string): string => {
        return "https://www.vagalume.com.br" + link;
    };

    const fullMusicNameArrayP = albumLinks.map(async (link) => {
        const allSongs: SongInfo = [];
        const artist = getArtist(link);
        const url = buildURL(link);
        const response = await AxiosInstance.get(url);
        const html = response.data; // Get the HTML from the HTTP request
        const $ = cheerio.load(html);
        const namesMusic = $(".nameMusic");
        namesMusic.each((_index, element) => {
            const fullMusicName = artist + " " + $(element).text();
            stream.write(fullMusicName + "\n");
            allSongs.push(fullMusicName);
        });
        return allSongs;
    });

    const fullMusicNameArray = await Promise.all(fullMusicNameArrayP);

    return fullMusicNameArray.flat(1);
};

const wrapper = async (): Promise<void> => {
    const response = await AxiosInstance.get(url);
    const html = response.data; // Get the HTML from the HTTP request
    const $ = cheerio.load(html); // Load the HTML string into cheerio

    const albumLinks: Array<string> = getAlbumLinks($);
    const allSongs: SongInfo = await getAllSongs(albumLinks);
    const file = await writeFile("./songs.txt", allSongs);
    console.log(allSongs.length);
};

wrapper();
