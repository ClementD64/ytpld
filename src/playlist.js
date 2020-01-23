const cheerio = require('cheerio');
const { fetch } = require('./utils');

class Playlist {
    constructor(url) {
        this.url = url;
        this.name = '';
        this.id = '';
        this.songs = [];
    }

    getId(url){
        return (/https:\/\/www\.youtube\.com\/playlist\?list=([a-zA-Z0-9_\-]+)/g.exec(url)
            || /https:\/\/www\.youtube\.com\/watch\?v=(?:[a-zA-Z0-9]+)&list=([a-zA-Z0-9]+)&t=[0-9]+/g.exec(url)
            || /^([a-zA-Z0-9]+)$/g.exec(url) || [])[1];
    }

    async getPlaylist() {
        this.id = this.getId(this.url);
        const body = await fetch(`https:\/\/www.youtube.com/playlist?list=${this.id}`);

        const $ = cheerio.load(body.toString());
        const thumb = $('tr');

        this.name = $('meta[name="title"]').attr("content").replace(' - YouTube', '');

        thumb.each((i, el) => {
            this.songs[i] = {
                name: el.attribs['data-title'],
                id: el.attribs['data-video-id']
            };
        });

        return this;
    }
}

module.exports = Playlist;