const { exec } = require('./utils');
const fs = require('fs');

class Cutter {
    constructor(filename, start, end) {
        this.filename = filename;
        this.start = start;
        this.end = end;
    }

    async cut() {
        await exec(`ffmpeg -i ${this.filename} -ss ${this.start} -to ${this.end} -acodec copy -f mp3 ${this.filename}.tmp`);
        await fs.promises.unlink(this.filename);
        await fs.promises.rename(`${this.filename}.tmp`, this.filename);
        return this;
    }
}

module.exports = Cutter;