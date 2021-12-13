import { pipe } from "fp-ts/function";
import { concatMap, Subject, of, delay } from "rxjs";
import * as E from "fp-ts/Either";
import { inpureGetSongsName } from "./adapters/song/inpure-get-songs-names";
import { getTheState } from "./adapters/song/state/inpure-append-state";
import { getSongInfo, getSongsName } from "./core/use-cases/song/get-song";
import { AppState, SongState } from "./state/types";
import { inpureGetSongInfo } from "./adapters/song/get-songs-info";
import {
  appendState,
  checkState,
  updateState,
} from "./core/use-cases/song/state";
import { inpureUpdateState } from "./adapters/song/state/inpure-update-state";
import { inpureCheckState } from "./adapters/song/state/inpure-check-state";
import { download } from "./core/use-cases/song/download";
import { inpureDownload } from "./adapters/song/download-song";

(async () => {
  // Queue Map
  /*  const mapQueue$: Subject<SongState> = new Subject<SongState>();
  mapQueue$
    .pipe(
      concatMap(async (song) => {
        const isOnTheStateEither = await checkState(inpureCheckState)(song)(
          "id"
        )();

        if (E.isLeft(isOnTheStateEither)) {
          //console.log(isOnTheStateEither.left.message);
          return;
        }

        const songInfoEither = await getSongInfo(inpureGetSongInfo)(song)();

        if (E.isRight(songInfoEither)) {
          await updateState(inpureUpdateState)(song)();
          return of(song).pipe(delay(100));
        }
        console.log(songInfoEither.left.message);
        return of(song).pipe(delay(100));
      })
    )
    .subscribe();

  // Get current AppState as a JSOM
  const currentAppStateJSON: AppState = await getTheState();

  // For each song call get songInfo
  currentAppStateJSON.songs.map((song) => {
    mapQueue$.next(song);
  }); */

  const downloaded$: Subject<SongState> = new Subject<SongState>();
  downloaded$
    .pipe(
      concatMap(async (song) => {
        const isAlreadyDownloaded = await checkState(inpureCheckState)(song)(
          "status"
        )();

        if (E.isLeft(isAlreadyDownloaded)) {
          console.log(isAlreadyDownloaded.left.message);
          return;
        }

        const downloadEither = await download(inpureDownload)(song)();

        if (E.isLeft(downloadEither)) {
          console.log(downloadEither.left.message);
          return;
        }
        song.status = "Downloaded";
        await updateState(inpureUpdateState)(song)();
        return of(song).pipe(delay(100));
      })
    )
    .subscribe();

  const appState = await getTheState();
  appState.songs.slice(1, 3).map((song) => {
    downloaded$.next(song);
  });
})();
