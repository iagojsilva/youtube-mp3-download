export interface SongState {
  songName: string;
  id: string | null;
  stage: "GatheringVagalume" | "GatheringYoutube" | "DownloadingYoutube";
  status: "Downloaded" | "Queue" | "Error" | "Off";
  error: {
    message: string;
  } | null;
}

export const emptySongState: SongState = {
  songName: "empty-state",
  id: null,
  stage: "GatheringVagalume",
  status: "Off",
  error: null,
};

export type AppState = {
  songs: Array<SongState>;
  songsCount: number;
};
