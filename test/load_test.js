import http from "k6/http";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
//   thresholds: {
//     http_req_duration: ["p(95)<1200"], // 95% of requests should be below 1200ms
//   },
  vus: 10,
  duration: "5s",
};

export default function () {
  http.get("http://localhost:8000/api/manga/search?title=naruto");
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}