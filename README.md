# ytplaylistd - Youtube Playlist Deamon

Watch and Download a Youtube playlist

## Usage

clone this repo, edit `docker-compose.yml` and run
```sh
docker-compose up -d --build
```

## Config

Configuration are done using environment variable

* `YTPLD_KEY` *required*: Your youtube api token
* `YTPLD_ID` *required*: Your playlist id
* `YTPLD_ARTIST`: The song artist in mp3 metadata *(default empty)*
* `YTPLD_OUT`: Song output dir *(default /mnt)*
* `YTPLD_PARSE_NAME_FILE`: File for a custom song name modifier
* `YTPLD_PARSE_NAME_FUNCTION`: Custom song name modifier (overwrite `YTPLD_PARSE_NAME_FILE`)

### Edit song name

#### Using file

```
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

## Workflow

```
songs = get playlist entries
for each song of songs
  if already downloaded
    ignore
  else
    download song
    analyse song # search empty start and outro
    cut song # remove empty start and outro
    edit song metadata
```