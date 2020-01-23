const { exec } = require('child_process');
const fs = require('fs');

class Analyzer {
    constructor(filename) {
        this.filename = filename;
        this.start = 0;
        this.end = 0;
        this.wave = [];
        this.pps = 10;
    }

    async analyze() {
        await this.getWave();
        this.getStart();
        this.getEnd();
    }

    async getWave() {
        await this.exec(`audiowaveform -i ${this.filename} -o ${this.filename}.json -b 8 --pixels-per-second ${this.pps}`);
        this.wave = JSON.parse((await fs.promises.readFile(`${this.filename}.json`)).toString());
        await fs.promises.unlink(`${this.filename}.json`);
    }

    getStart() {
        for (let i = 0; i < this.wave.length; i++) {
            if (this.wave[i] !== 0) {
                return this.start = i / this.pps;
            }
        }
    }

    getEnd() {
        for (let i = this.start; i < this.wave.length; i++) {
            if (this.wave[i] !== 0) {
                return this.end = i / this.pps;
            }
        }

        // if no end found
        return this.wave.length / this.pps;
    }

    exec(cmd) {
        return new Promise((resolve, reject) => {
            exec(cmd, err => err ? reject() : resolve());
        });
    }
}

module.exports = Analyzer;