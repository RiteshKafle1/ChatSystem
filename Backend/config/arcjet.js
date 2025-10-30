import arcjet, { shield, detectBot } from "@arcjet/node";

import { ENV } from "./.env.js";

export const aj = arcjet({
  key: ENV.ARCJET_SECRET_KEY,
  rules: [
    shield({ mode: "DRY_RUN" }), //Blocks known exploit patterns (XSS, SQL injection, directory traversal, etc.)

    detectBot({
      mode: "DRY_RUN",
      allow: ["CATEGORY:SEARCH_ENGINE"],
      blockSpoofed: true,
    }), //Detects headless browsers, automation tools, fake user-agents, and botnets
  ],
});
