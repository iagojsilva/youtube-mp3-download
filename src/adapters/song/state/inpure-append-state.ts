import { createWriteStream } from "fs";
import { readFile } from "fs/promises";
import { InpureAppendState } from "../../../core/use-cases/song/state";
import { AppState, SongState } from "../../../state/types";

export const STATE_PATH = "./state.json";

export const inpureAppendState: InpureAppendState<void> = async (
  state: SongState
) => {
  try {
    // Get current AppState as a JSOn
    const currentAppStateJSON: AppState = await getTheState();

    // Create the state handler
    const stateHandler = createWriteStream(STATE_PATH, { flags: "w+" });
    // Append the state to the currentAppStateJSON
    currentAppStateJSON.songs.push(state);

    // Set the songs quantity
    currentAppStateJSON.songsCount = currentAppStateJSON.songs.length;

    // Transform newAppStateJson from json to string
    const newAppStateString = JSON.stringify(currentAppStateJSON);

    // Write the new AppState to the State
    stateHandler.write(newAppStateString);
    stateHandler.close();
  } catch (error) {
    throw new Error(`Failed to append to the state: ${error}`);
  }
};

export const getTheState = async (): Promise<AppState> => {
  const appStateFromStringToJSON = (appState: string): AppState =>
    appState.length > 1
      ? JSON.parse(appState)
      : {
          songs: [],
          songsCount: 0,
        };

  // Get current AppState as a string
  const currentAppStateString = await readFile(STATE_PATH, "utf-8");

  // Transform the currentAppStateString from string to JSON
  const currentAppStateJSON: AppState = appStateFromStringToJSON(
    currentAppStateString
  );

  return currentAppStateJSON;
};
