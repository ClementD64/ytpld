const Playlist = require('./playlist');
const Downloader = require('./downloader');
const Analyzer = require('./analyzer');
const Cutter = require('./cutter');
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
        const tmpFile = `/tmp/${song.id}.mp3`;
        await new Downloader(song.id, tmpFile).download();
        const analyzer = await new Analyzer(tmpFile).analyze();
        await new Cutter(tmpFile, analyzer.start, analyzer.end).cut();
    }

    getName(name) {
        for (const i of this.config.remove) {
            name = name.replace(new RegExp(i, 'g'), '');
        }
        return name;
    }

    getFilename(name) {
        return name.replace(/[\/?<>\\:*|"^ ]/g, '-').replace(/_{2,}/g, '-');
    }
}

module.exports = Manager;