import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { SongState } from "../../../state/types";

// Signature of our InpureDownload function
export type InpureDownload<A> = (song: SongState) => Promise<A>;

// Signature of our pure download function
type Download = <A>(
  inpureDownload: InpureDownload<A>
) => (song: SongState) => TE.TaskEither<Error, A>;

// Our function to download
export const download: Download = (inpureDownload) => (song) => {
  return pipe(TE.tryCatch(() => inpureDownload(song), E.toError));
};
