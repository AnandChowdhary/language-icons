import * as fs from "fs";
import { join } from "path";

import { widths } from "./widths";
import * as colors from "./colors.json";

const leftMargin = (code: string) => {
  const totalWidth = 128;
  let width = 0;
  code.split("").forEach((character) => {
    character = character.toUpperCase();
    if (widths[character]) {
      width += widths[character];
    }
  });

  return Math.floor((totalWidth - width) / 2);
};

const read = (fileName: string) =>
  fs.promises.readFile(join(__dirname, fileName), "utf8");

const writeIcon = (code: string, data: string) =>
  fs.promises.writeFile(join(__dirname, "icons", `${code}.svg`), data);

async function main() {
  console.log(`Generating ${Object.keys(colors).length} icons...`);
  const templates = await Promise.all([
    read("one-color.svg"),
    read("two-colors.svg"),
    read("three-colors.svg"),
  ]);

  const iconDir = join(__dirname, "icons");
  if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir);
  }

  return Promise.all(
    Object.keys(colors).map((code) =>
      writeIcon(
        code,
        templates[colors[code].length ? colors[code].length - 1 : 1]
          .replace("LANGUAGE_CODE", code.toUpperCase())
          .replace(`x="20"`, `x="${leftMargin(code)}"`)
          .replace("COLOR_1", colors[code].length ? colors[code][0] : "#2980b9")
          .replace("COLOR_2", colors[code][1])
          .replace("COLOR_3", colors[code][2])
      )
    )
  );
}

main()
  .then(() => console.log("Icons are generated!"))
  .catch((error) => console.log("Error", error));
