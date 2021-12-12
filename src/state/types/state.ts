export interface State {
  songName: string;
  id: string | null;
  stage: "GatheringVagalume" | "GatheringYoutube" | "DownloadingYoutube";
  status: "Downloaded" | "Queue" | "Error" | "Off";
  error: {
    message: string;
  } | null;
}

export type AppState = Array<State>;

/**
 * [
  {
    "songName": "string",
    "status": "Downloaded",
    "error": {
      "message": "string"
    }
  },
  {
    "songName": "string",
    "status": "Downloaded",
    "error": {
      "message": "string"
    }
  }
]

 */
