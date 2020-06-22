const fs = require("fs");
const os = require("os");

const config = {
  key: process.env.YTPLD_KEY,
  id: process.env.YTPLD_ID,
  artist: process.env.YTPLD_ARTIST ?? "",
  out: process.env.YTPLD_OUT ?? "/mnt",
  parseNameFile: process.env.YTPLD_PARSE_NAME_FILE,
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

module.exports = config;
