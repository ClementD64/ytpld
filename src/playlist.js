const youtubeApi = require("./youtube");

class Playlist {
  constructor(id) {
    this.id = id;
    this.data = {
      list: [],
    };
  }

  async fetch() {
    this.data.name = await this.getName();
    await this.getPlaylist();
    return this.data;
  }

  async getName() {
    const data = await youtubeApi("playlists", {
      part: "snippet",
      id: this.id,
    });

    return data.items[0].snippet.title;
  }

  async getPlaylist(pageToken) {
    const data = await youtubeApi("playlistItems", {
      part: "snippet",
      playlistId: this.id,
      maxResults: 50,
      pageToken,
    });

    for (const entry of data.items) {
      this.data.list.push({
        id: entry.snippet.resourceId.videoId,
        name: entry.snippet.title,
        image: entry.snippet.thumbnails.maxres?.url ??
          entry.snippet.thumbnails.standard?.url ??
          entry.snippet.thumbnails.high?.url ??
          entry.snippet.thumbnails.medium?.url ??
          entry.snippet.thumbnails.default?.url,
      });
    }

    if (data.nextPageToken) {
      return this.getPlaylist(data.nextPageToken);
    }
  }
}

module.exports = (id) => new Playlist(id).fetch();
