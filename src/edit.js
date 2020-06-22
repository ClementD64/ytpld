const ID3Writer = require("browser-id3-writer");
const fs = require("fs").promises;

function downloadCover(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 400) {
        return reject(new Error(`Failed to download cover.`));
      }
      if (res.statusCode >= 300) {
        return resolve(fetch(res.headers["location"]));
      }

      const buf = [];
      res.on("data", (chunk) => buf.push(chunk));
      res.on("end", () => resolve(Buffer.concat(buf)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

module.exports = async function edit({
  filename,
  coverUrl,
  title,
  artist,
  album,
}) {
  const [fileData, coverData] = await Promise.all([
    fs.readFile(filename),
    downloadCover(coverUrl),
  ]);

  const writer = new ID3Writer(fileData)
    .setFrame("TIT2", title) // title
    .setFrame("TPE1", [artist]) //song artist
    .setFrame("TALB", album) // album title
    .setFrame("APIC", { // cover
      type: 3,
      data: coverData,
      description: "",
    });
  writer.addTag();

  await fs.writeFile(filename, Buffer.from(writer.arrayBuffer));
};
