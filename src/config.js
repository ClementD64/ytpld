const fs = require("fs");
const os = require("os");

const config = {
  key: process.env.YTPLD_KEY,
  id: process.env.YTPLD_ID,
  artist: process.env.YTPLD_ARTIST ?? "",
  out: process.env.YTPLD_OUT ?? "/mnt",
  playlistNameAsAlbum: process.env.YTPLD_PLAYLIST_NAME_AS_ALBUM ?? false,
  parseNameFile: process.env.YTPLD_PARSE_NAME_FILE,
  fix: {},
};

if (typeof config.key === "undefined") {
  console.error("A token api key is required");
  process.exit(1);
}

if (typeof config.id === "undefined") {
  console.error("A playlist id is required");
  process.exit(1);
}

if (process.env.YTPLD_PARSE_NAME_FUNCTION) {
  const file = `${os.tmpdir()}/ytpld_parse_name.js`;
  fs.writeFileSync(
    file,
    `module.exports = ${process.env.YTPLD_PARSE_NAME_FUNCTION}`,
  );
  config.parseNameFile = file;
}

function addConfigFix(id, pos, envKey) {
  config.fix[id] = config.fix[id] ?? {};
  config.fix[id][pos] = Number(process.env[envKey]);
  if (isNaN(config.fix[id][pos])) {
    console.error(`Unvalid value for ${envKey}`);
    process.exit(1);
  }
}

for (const i in process.env) {
  if (i.startsWith("YTPLD_FIX_START_")) {
    addConfigFix(i.slice(16), "start", i);
  } else if (i.startsWith("YTPLD_FIX_END_")) {
    addConfigFix(i.slice(14), "end", i);
  }
}

module.exports = config;
