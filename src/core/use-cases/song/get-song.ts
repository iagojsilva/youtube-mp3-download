import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { SongState } from "../../../state/types";

// Signature of our InpureUpdateState function
export type InpureGetSongsName<A> = () => Promise<A>;

// Signature of our pure UpdateState function
export type GetSongsName = <A>(
  inpureGetSongsName: InpureGetSongsName<A>
) => TE.TaskEither<Error, A>;

// Our function to update the state
export const getSongsName: GetSongsName = (inpureGetSongsName) => {
  return TE.tryCatch(() => inpureGetSongsName(), E.toError);
};

// Signature of our InpureUpdateState function
export type InpureGetSongInfo<A> = (song: SongState) => Promise<A>;

// Signature of our pure UpdateState function
export type GetSongInfo = <A>(
  inpureGetSongInfo: InpureGetSongInfo<A>
) => (song: SongState) => TE.TaskEither<Error, A>;

// Our function to update the state
export const getSongInfo: GetSongInfo = (inpureGetSongInfo) => (song) => {
  return TE.tryCatch(() => inpureGetSongInfo(song), E.toError);
};
