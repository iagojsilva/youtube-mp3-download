export interface State {
  songName: string;
  status: "Downloaded" | "Queue" | "Error";
  error: {
    message: string;
  };
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
