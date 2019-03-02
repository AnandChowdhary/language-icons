import { read, write } from "./files";
import { widths } from "./widths";
import * as colors from "./colors.json";

const templates: string[] = [];
const leftMargin = (code: string) => {
  const totalWidth = 128;
  let width = 0;
  code.split("").forEach(character => {
    character = character.toUpperCase();
    if (widths[character]) width += widths[character];
  });
  return Math.floor((totalWidth - width) / 2);
};

console.log(`Generating ${Object.keys(colors).length} icons...`);
read("one-color.svg")
  .then((oneColor: string) => templates.push(oneColor))
  .then(() => read("two-colors.svg"))
  .then((twoColors: string) => templates.push(twoColors))
  .then(() => read("three-colors.svg"))
  .then((threeColors: string) => templates.push(threeColors))
  .then(() => Object.keys(colors))
  .then(keys =>
    keys.map(code =>
      write(
        `${code}.svg`,
        templates[colors[code].length ? colors[code].length - 1 : 1]
          .replace("LANGUAGE_CODE", code.toUpperCase())
          .replace(`x="20"`, `x="${leftMargin(code)}"`)
          .replace("COLOR_1", colors[code].length ? colors[code][0] : "#2980b9")
          .replace("COLOR_2", colors[code][1])
          .replace("COLOR_3", colors[code][2])
      )
    )
  )
  .then(promises => Promise.all(promises))
  .then(() => console.log("Icons are generated!"))
  .catch(error => console.log("Error", error))
  .then(() => process.exit());
