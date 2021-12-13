import { InpureCheckState } from "../../../core/use-cases/song/state";
import { getTheState } from "./inpure-append-state";
import { AppState, emptySongState, SongState } from "../../../state/types";

export const inpureCheckState: InpureCheckState<SongState> = async (
  songObj,
  key
) => {
  try {
    // Transform the app state from string to json
    const currentAppStateJSON: AppState = await getTheState();

    // Check if the song already exists in the state
    const alreadyExists = currentAppStateJSON.songs
      .filter((song) => song.songName === songObj.songName)
      .every((song) => song[key] === "Downloaded");

    if (alreadyExists) throw new Error(`${key} is already set`);
    return songObj;
  } catch (err) {
    throw new Error(err as string);
  }
};
