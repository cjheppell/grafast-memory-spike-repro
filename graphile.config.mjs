import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makePgService } from "postgraphile/adaptors/pg";
import { MyPlugin } from "./languageplugin.mjs";
import chalk from "chalk";

/** @type {GraphileConfig.Preset} */
const preset = {
  extends: [PostGraphileAmberPreset],
  pgServices: [
    makePgService({
      connectionString:
        "postgres://postgres:mysecretpassword1@localhost:5432/grafast_repro",
    }),
  ],
  grafast: {
    explain: true
  },
  grafserv: { watch: true },
  plugins: [MyPlugin],
};

console.log(`\n\n`);

setInterval(() => {
  process.stderr.clearLine(0);
  process.stderr.cursorTo(0);
  process.stderr.write(
    chalk.yellow(
      `heap ${parseFloat(process.memoryUsage().heapTotal * 0.000001).toFixed(
        2
      )}MB`
    )
  );
}, 250);

export default preset;
