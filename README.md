# ytpld - Youtube Playlist Daemon

Watch and Download a Youtube playlist

## Usage

```yml
version: "3"

services: 
  ytpld:
    build: github.com/ClementD64/ytpld.git
    restart: unless-stopped
    volumes:
      - /path/to/output:/mnt
    environment: 
      - YTPLD_KEY=<Your Youtube Api Token>
      - YTPLD_ID=<Your Playlist ID>
```

## Config

Configuration are done using environment variable

* `YTPLD_KEY` *required*: Your youtube api token
* `YTPLD_ID` *required*: Your playlist id
* `YTPLD_ARTIST`: The song artist in mp3 metadata *(default empty)*
* `YTPLD_OUT`: Song output dir *(default /mnt)*
* `YTPLD_PLAYLIST_NAME_AS_ALBUM`: Use playlist name as album title. Else, song title will be used *(default false)*
* `YTPLD_PARSE_NAME_FILE`: File for a custom song name modifier
* `YTPLD_PARSE_NAME_FUNCTION`: Custom song name modifier (overwrite `YTPLD_PARSE_NAME_FILE`)

### Edit song name

#### Using file

```js
// handleName.js
module.exports = function(name) {
  return [...name].reverse().join('')
}
```

set environment variable `YTPLD_PARSE_NAME_FILE` to `handleName.js`

#### Using Environment Variable

```sh
YTPLD_PARSE_NAME_FUNCTION="function(name) { return [...name].reverse().join('') }"
```
