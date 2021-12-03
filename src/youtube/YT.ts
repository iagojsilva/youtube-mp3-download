import YoutubeMp3Downloader, {
  IVideoTask,
  IYoutubeMp3DownloaderOptions,
} from "youtube-mp3-downloader";

export type ID = string;
export type MusicName = string;

export const YTDownloadMany = (musics: Record<ID, MusicName>): void => {
  const options: IYoutubeMp3DownloaderOptions = {
    outputPath: "/home/i/Music/yt-downloader", // Output file location (default: the home directory)
    youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
    queueParallelism: 2, // Download parallelism (default: 1)
    progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
    allowWebm: false, // Enable download from WebM sources (default: false)
  };

  const YT = new YoutubeMp3Downloader(options);
  const IDs = Object.keys(musics);
  IDs.forEach((id) => {
    YT.download(id, musics[id]);
    YT.on("finished", (err, data) => {
      console.log("finhisied", data, err);
    });
    YT.on("progress", (videoTask: IVideoTask) => {
      console.log(musics[videoTask.videoId], videoTask.progress.percentage);
    });
  });
};
