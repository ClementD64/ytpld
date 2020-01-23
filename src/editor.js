const { fetch } = require('./utils');
const ID3Writer = require('browser-id3-writer');
const fs = require('fs');

class Editor {
    constructor(filename, id, title, artist, album) {
        this.filename = filename;
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.album = album;
    }

    async edit() {
        const [fileData, coverData] = await Promise.all([
            fs.promises.readFile(this.filename),
            this.downloadCover()
        ]);

        const writer = new ID3Writer(fileData)
            .setFrame('TIT2', this.title) // title
            .setFrame('TPE1', [this.artist]) //song artist
            .setFrame('TALB', this.album) // album title
            .setFrame('APIC', { // cover
                type: 3,
                data: coverData,
                description: ""
            });
        writer.addTag();
        
        await fs.promises.writeFile(this.filename, Buffer.from(writer.arrayBuffer))
    }

    downloadCover() {
        return fetch(`https://i.ytimg.com/vi/${this.id}/maxresdefault.jpg`)
            .catch(_ => fetch(`https://i.ytimg.com/vi/${this.id}/hqdefault.jpg`))
            .catch(_ => fetch(`https://i.ytimg.com/vi/${this.id}/default.jpg`));
    }
}

module.exports = Editor;