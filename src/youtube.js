const https = require("https");
const config = require("./config");

module.exports = function youtubeApi(endPoint, params) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endPoint}`);
  url.searchParams.append("key", config.key);

  for (const param in params) {
    if (typeof params[param] !== "undefined") {
      url.searchParams.append(param, params[param]);
    }
  }

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const buf = [];
      res.on("data", (chunk) => buf.push(chunk));
      res.on("end", () => {
        const data = JSON.parse(Buffer.concat(buf));
        !!data.error ? reject(data) : resolve(data);
      });
      res.on("error", reject);
    }).on("error", reject);
  });
};
