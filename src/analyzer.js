const { exec } = require('./utils');
const fs = require('fs');

class Analyzer {
    constructor(filename) {
        this.filename = filename;
        this.start = 0;
        this.startIndex = 0;
        this.end = 0;
        this.endIndex = 0;
        this.wave = [];
        this.pps = 10;
    }

    async analyze() {
        await this.getWave();
        this.getStart();
        this.getEnd();
        return this;
    }

    async getWave() {
        await exec(`./audiowaveform -i ${this.filename} -o ${this.filename}.json -b 8 --pixels-per-second ${this.pps}`);
        this.wave = JSON.parse((await fs.promises.readFile(`${this.filename}.json`)).toString()).data;
        await fs.promises.unlink(`${this.filename}.json`);
    }

    getStart() {
        for (let i = 0; i < this.wave.length; i++) {
            if (this.wave[i] !== 0) {
                this.startIndex = i;
                break;
            }
        }
        this.start = Math.floor(this.startIndex / this.pps / 2);
    }

    getEnd() {
        for (let i = this.startIndex; i < this.wave.length; i++) {
            if (this.wave[i] === 0) {
                this.endIndex = i;
                break;
            }
        }
        this.end = Math.ceil((this.endIndex !== 0 ? this.endIndex : this.wave.length) / this.pps / 2);
    }
}

module.exports = Analyzer;