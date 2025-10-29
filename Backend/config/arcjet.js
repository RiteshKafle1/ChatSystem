import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

import { ENV } from "./.env.js";

export const aj = arcjet({
  key: ENV.ARCJET_SECRET_KEY,
  rules: [
    shield({ mode: "LIVE" }), //Blocks known exploit patterns (XSS, SQL injection, directory traversal, etc.)

    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
      blockSpoofed: true,
    }), //Detects headless browsers, automation tools, fake user-agents, and botnets

    detectAbuse({
      mode: "LIVE",
      block: true,
    }),
    //Detects behavioral abuse (like login brute-force, scraping, spam requests)
  ],
});
