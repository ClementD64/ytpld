const config = require("./config");
const fs = require("fs");
const os = require("os");

const playlist = require("./playlist");
const download = require("./download");
const analyze = require("./analyze");
const cut = require("./cut");
const edit = require("./edit");

const parseName = config.parseNameFile
  ? require(config.parseNameFile)
  : (_) => _;

const exist = (s) =>
  new Promise((r) => fs.access(s, fs.constants.F_OK, (e) => r(!e)));

async function mvFile(source, dest) {
  await new Promise((resolve, reject) =>
    fs.createReadStream(source)
      .pipe(fs.createWriteStream(dest))
      .on("finish", resolve)
      .on("error", reject)
  );
  await fs.promises.unlink(source);
}

class Main {
  async check() {
    const data = await playlist(config.id);

    for (const song of data.list) {
      if (await exist(`${config.out}/${song.id}.mp3`)) {
        continue;
      }

      try {
        await this.download(song, data.name);
      } catch (e) {
        console.error(`Failed to download ${song.name}`);
      }
    }
  }

  async download(song, playlistName) {
    const filename = `${config.out}/${song.id}.mp3`;
    const tmpFile = `${os.tmpdir()}/${song.id}.mp3`;

    await download(song.id, tmpFile);
    const analyzed = await analyze(tmpFile);
    await cut(tmpFile, config.fix[song.id]?.start ?? analyzed.start, config.fix[song.id]?.end ?? analyzed.end);
    const title = parseName(song.name).toString().trim();
    await edit({
      filename: tmpFile,
      coverUrl: song.image,
      title: parseName(song.name).toString().trim(),
      artist: config.artist,
      album: config.playlistNameAsAlbum ? playlistName : title,
    });
    await mvFile(tmpFile, filename);
  }

  async cron() {
    await this.check().catch(console.error);
    setTimeout(() => this.cron(), 3600000);
  }
}

new Main().cron();
