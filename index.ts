import { read, write } from "./files";
import * as colors from "./colors.json";

console.log(`Generating ${Object.keys(colors).length} icons...`);
let templates: string[] = [];

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
        templates[colors[code].length - 1]
          .replace("LANGUAGE_CODE", code.toUpperCase())
          .replace("COLOR_1", colors[code][0])
          .replace("COLOR_2", colors[code][1])
          .replace("COLOR_3", colors[code][2])
      )
    )
  )
  .then(promises => Promise.all(promises))
  .then(() => console.log("Icons are generated!"))
  .catch(error => console.log("Error", error))
  .then(() => process.exit());
