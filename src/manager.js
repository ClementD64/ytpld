const Playlist = require('./playlist');
const Downloader = require('./downloader');
const Analyzer = require('./analyzer');
const Cutter = require('./cutter');
const Editor = require('./editor');
const fs = require('fs');

class Manager {
    constructor(config) {
        this.config = config;
    }

    async check() {
        const list = await new Playlist(this.config.playlist).getPlaylist();
        
        let i = 0;
        const next = () => typeof list.songs[i] !== 'undefined'
            ? this.download(list.songs[i++], list).then(next)
            : null;

        const promise = [];
        for (let j = 0; j < this.config.process; j++)
            promise.push(next());
        await Promise.all(promise);
    }

    async download(song, list) {
        const name = this.getName(song.name);
        const file = `${this.config.outDir}${this.config.outDir.endsWith('/') ? '' : '/'}${this.getFilename(name)}.mp3`;
        try {
            await fs.promises.access(file);
            return;
        } catch (e) {}
        const tmpFile = `/tmp/${song.id}.mp3`;
        await new Downloader(song.id, tmpFile).download();
        const analyzer = await new Analyzer(tmpFile).analyze();
        await new Cutter(tmpFile, analyzer.start, analyzer.end).cut();
        await new Editor(tmpFile, song.id, name, this.config.artist, list.name).edit();
        await this.mvFile(tmpFile, file);
    }

    async mvFile(source, dest) {
        await new Promise((resolve, reject) =>
            fs.createReadStream(source)
                .pipe(fs.createWriteStream(dest))
                .on('finish', resolve)
                .on('error', reject)
        );
        await fs.promises.unlink(source);
    }

    getName(name) {
        for (const i of this.config.remove) {
            name = name.replace(new RegExp(i, 'g'), '');
        }
        return name.trim();
    }

    getFilename(name) {
        return name.replace(/[\/?<>\\:*|"^ ]/g, '-').replace(/-+/g, '-');
    }
}

module.exports = Manager;