import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

type InpureDownload<A> = (name: string) => Promise<A>;

type Download = <A>(
  inpureDownload: InpureDownload<A>
) => (songName: string) => TE.TaskEither<Error, A>;

export const download: Download = (inpureDownload) => (songName) => {
  return pipe(TE.tryCatch(() => inpureDownload(songName), E.toError));
};
