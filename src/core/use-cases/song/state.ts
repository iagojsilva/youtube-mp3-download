import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { State } from "../../../state/types/state";

// Signature of our InpureUpdateState function
type InpureUpdateState<A> = (state: Partial<State>, id: string) => Promise<A>;

// Signature of our pure UpdateState function
type UpdateState = <A>(
  inpureUpdateState: InpureUpdateState<A>
) => (state: State) => (id: string) => TE.TaskEither<Error, A>;

// Our function to update the state
export const updateState: UpdateState =
  (inpureUpdateState) => (state) => (id) => {
    return TE.tryCatch(() => inpureUpdateState(state, id), E.toError);
  };

// Signature of our InpureAppendState function
export type InpureAppendState<A> = (state: State) => Promise<A>;

// Signature of our pure UpdateState function
export type AppendState = <A>(
  inpureAppendState: InpureAppendState<A>
) => (state: State) => TE.TaskEither<Error, A>;

// Our function to append to the state
export const appendState: AppendState =
  (inpureAppendState) => (state: State) => {
    return TE.tryCatch(() => inpureAppendState(state), E.toError);
  };
