import axios from "axios";

// TODO: replace with your own Cloudflare-hosted domain once ready.
// Prefer a custom domain over a shared pub-*.r2.dev URL — some ISPs
// (e.g. Indonesia's Trust+ Positif) blanket-block the shared r2.dev
// platform domain at the DNS level, which would break this for players.
// See docs/launcher-update.template.json / docs/launcher-update.template.README.md.
const BASE_URL = "https://REPLACE_ME.example.com/";
const REQUEST_TIMEOUT = 30000; // 30 seconds

const api = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.warn("Request timeout");
    }
    return Promise.reject(error);
  }
);

export default api;
