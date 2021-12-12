import { createWriteStream } from "fs";
import { BehaviorSubject, concatMap, delay, mergeMap, of } from "rxjs";
import YoutubeMp3Downloader, {
  IYoutubeMp3DownloaderOptions,
} from "youtube-mp3-downloader";
import { downloadQueue$ } from "../../main";
import { sleep } from "../../utils/sleep";

export type ID = string;
export type MusicName = string;

const downloaded$ = new BehaviorSubject("");

const stream = createWriteStream("download.txt", { flags: "a" });

export const downloadOne = (): void => {
  const options: IYoutubeMp3DownloaderOptions = {
    outputPath: "/home/i/Music/yt-downloader", // Output file location (default: the home directory)
    youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
    queueParallelism: 5, // Download parallelism (default: 1)
    progressTimeout: 30000, // Interval in ms for the progress reports (default: 1000)
    allowWebm: false, // Enable download from WebM sources (default: false)
  };

  const youtubeDownloader = new YoutubeMp3Downloader(options);

  youtubeDownloader.on("queueSize", (queueSize: number) => {
    console.log(`The queue size is: [${queueSize}]`);
  });

  youtubeDownloader.on("finished", (err, _data) => {
    if (err) {
      console.log(err);
      return;
    }
    stream.write(`${_data.videoTitle}\n`);
    console.log(`[+] ${_data.videoTitle}`);
    downloaded$.next(_data.videoId);
  });
  downloadQueue$
    .pipe(
      concatMap((obs, index) => {
        return of(obs).pipe(delay(1000));
      }),
      mergeMap(async (songMetadata, i) => {
        const musicID = songMetadata.musicID;
        if (musicID === undefined) return;
        console.log(i, `yt-dl == called with ${songMetadata.musicName}`);
        youtubeDownloader.download(musicID, songMetadata.musicName);
        await sleep(30000);
      }, 5)
    )
    .subscribe();
  /* downloadQueue$.subscribe((value) => {
        const musicID = value.musicID;
        if (musicID === undefined) return;
        youtubeDownloader.download(musicID, value.musicName);
    }); */
};
