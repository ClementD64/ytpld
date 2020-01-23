const fs = require('fs');

class Config {
    constructor(filename) {
        this.filename = filename;
        this.playlist = null;
    }

    async init() {
        await this.createIfNotExist();
        const json = JSON.parse((await fs.promises.readFile('config.json')).toString());
        this.playlist = json.playlist || null;
        this.remove = json.remove || [];
        this.process = json.process || 1;
        return this;
    }

    async createIfNotExist() {
        try {
            await fs.promises.access('config.json');
        } catch (e) {
            await fs.promises.writeFile('config.json', JSON.stringify({
                playlist: null,
                remove: [],
                process: 1
            }, null, 4));
        }
    }
}

module.exports = Config;