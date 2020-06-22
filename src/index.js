const config = require("./config");
const fs = require("fs");
const os = require("os");

const playlist = require("./playlist");
const download = require("./download");
const analyze = require("./analyze");
const cut = require("./cut");
const edit = require("./edit");

const parseName = !!config.parseNameFile
  ? require(config.parseNameFile)
  : (_) => _;

const exist = (s) =>
  new Promise((r) => fs.access(s, fs.constants.F_OK, (e) => r(!e)));

class Main {
  async check() {
    const data = await playlist(config.id);

    for (const song of data.list) {
      if (await exist(`${song.id}.mp3`)) {
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
    const filename = `${config.out}${
      config.out.endsWith("/") ? "" : "/"
    }${song.id}.mp3`;
    const tmpFile = `${os.tmpdir()}/${song.id}.mp3`;

    await download(song.id, tmpFile);
    const analyzed = await analyze(tmpFile);
    await cut(tmpFile, analyzed.start, analyzed.end);
    await edit({
      filename: tmpFile,
      coverUrl: song.image,
      title: parseName(song.name).toString().trim(),
      artist: config.artist,
      album: playlistName,
    });
    await fs.promises.rename(tmpFile, filename);
  }

  async cron() {
    await this.check().catch(console.error);
    setTimeout(() => this.cron(), 3600000);
  }
}

new Main().cron();
