import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

import { ENV } from "./.env.js";

export const aj = arcjet({

  key: ENV.ARCJET_SECRET_KEY,
  rules: [
    shield({ mode: "LIVE" }),

    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    slidingWindow({
      mode: "LIVE",
      max: 100,
      interval: 60,
    }),
  ],
});
