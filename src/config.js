const fs = require('fs');

class Config {
    constructor(filename) {
        this.filename = filename;
    }

    async init() {
        await this.createIfNotExist();
        const json = JSON.parse((await fs.promises.readFile('config.json')).toString());
        this.playlist = json.playlist || null;
        this.outDir = json.outDir || '.';
        this.artist = json.artist || '';
        this.process = json.process || 1;
        this.remove = json.remove || [];
        return this;
    }

    async createIfNotExist() {
        try {
            await fs.promises.access('config.json');
        } catch (e) {
            await fs.promises.writeFile('config.json', JSON.stringify({
                playlist: null,
                outDir: '.',
                artist: '',
                process: 1,
                remove: []
            }, null, 4));
        }
    }
}

module.exports = Config;