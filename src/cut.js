const fs = require("fs").promises;
const exec = require("util")
  .promisify(require("child_process").exec);

module.exports = async function cut(filename, start, end) {
  await exec(
    `ffmpeg -i ${filename} -ss ${start} -to ${end} -acodec copy -f mp3 ${filename}.tmp`,
  );
  await fs.unlink(filename);
  await fs.rename(`${filename}.tmp`, filename);
};
