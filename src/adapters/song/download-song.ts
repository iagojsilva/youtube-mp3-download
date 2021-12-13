import { delay, of } from "rxjs";
import YoutubeMp3Downloader, {
  IYoutubeMp3DownloaderOptions,
} from "youtube-mp3-downloader";
import { SongState } from "../../state/types";

export const inpureDownload = async (song: SongState): Promise<any> => {
  try {
    const options: IYoutubeMp3DownloaderOptions = {
      outputPath: "/home/i/Music/yt-downloader", // Output file location (default: the home directory)
      youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
      queueParallelism: 2, // Download parallelism (default: 1)
      progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
      allowWebm: false, // Enable download from WebM sources (default: false)
    };
    const yt = new YoutubeMp3Downloader(options);

    if (song.id === null) return;
    yt.download(song.id, song.songName);
    return of(null).pipe(delay(5000)).subscribe();
  } catch (err) {
    throw new Error(err as any);
  }
};
