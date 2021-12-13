import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { SongState } from "../../../state/types/state";

// Signature of our InpureUpdateState function
export type InpureUpdateState<A> = (state: SongState) => Promise<A>;

// Signature of our pure UpdateState function
export type UpdateState = <A>(
  inpureUpdateState: InpureUpdateState<A>
) => (state: SongState) => TE.TaskEither<Error, A>;

// Our function to update the state
export const updateState: UpdateState = (inpureUpdateState) => (state) => {
  return TE.tryCatch(() => inpureUpdateState(state), E.toError);
};

// Signature of our InpureAppendState function
export type InpureAppendState<A> = (state: SongState) => Promise<A>;

// Signature of our pure UpdateState function
export type AppendState = <A>(
  inpureAppendState: InpureAppendState<A>
) => (state: SongState) => TE.TaskEither<Error, A>;

// Our function to append to the state
export const appendState: AppendState =
  (inpureAppendState) => (state: SongState) => {
    return TE.tryCatch(() => inpureAppendState(state), E.toError);
  };

// Signature of our InpureCheckState function
export type InpureCheckState<A> = (
  song: SongState,
  key: keyof SongState
) => Promise<A>;

// Signature of our pure CheckState function
export type CheckState = <A>(
  inpureCheckState: InpureCheckState<A>
) => (song: SongState) => (key: keyof SongState) => TE.TaskEither<Error, A>;

// Our function to check the state
export const checkState: CheckState = (inpureCheckState) => (song) => (key) => {
  return TE.tryCatch(() => inpureCheckState(song, key), E.toError);
};
