const fs = require('fs');
const ytdl = require('ytdl-core');

class Downloader {
    constructor(id, filename) {
        this.id = id;
        this.filename = filename;
    }

    download() {
        return new Promise((resolse, reject) => {
            ytdl(`http://www.youtube.com/watch?v=${this.id}`, {
                filter: 'audioonly',
                quality: 'highest'
            })
            .pipe(fs.createWriteStream(this.filename))
            .on('end', () => resolse(this))
            .on('error', reject);
        });
    }
}

module.exports = Downloader;