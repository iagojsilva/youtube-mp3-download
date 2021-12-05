import { mergeMap, ReplaySubject, tap } from "rxjs";
import { fromFileToList } from "./utils/file";
import { downloadOne } from "./youtube/youtube-downloader";
import { getDownloadInfo, SongMetadata } from "./youtube/youtube-scraper";

export const getMetadataQueue$: ReplaySubject<string> = new ReplaySubject();
export const downloadQueue$: ReplaySubject<SongMetadata> = new ReplaySubject();

(async () => {
    const songsNames = await fromFileToList();
    downloadOne();
    getMetadataQueue$
        .pipe(
            mergeMap(async (songName) => {
                const songMetadata = await getDownloadInfo(songName);
                downloadQueue$.next(songMetadata);
                console.log(
                    `[+] downloadQueue emited: ${songMetadata.musicName} `
                );
            }, 3)
        )
        .subscribe();

    songsNames.forEach((songName) => {
        getMetadataQueue$.next(songName);
        console.log(`[+] getMetadataQueue$ emited: ${songName}`);
    });

    /*  count$.subscribe((value) => {
        console.log(`count: ${count$.getValue()}`);
        if (value >= 1) {
            return;
        }
        const songName = songsNames.shift();
        count$.next(count$.getValue() + 1);
        if (songName === undefined) return;
        getMetadataQueue$.next(songName);
        console.log("[+] getMetadataQueue emited");
    }); */
})();
