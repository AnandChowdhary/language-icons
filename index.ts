import * as fs from 'fs';
import { join } from 'path';

import { widths } from './widths';
import * as colors from './colors.json';


/** Path of the root directory accessed from the distribution directory. */
const rootDir: string = join(__dirname, '..');
/** Output directory of the language icon files. */
const iconsDir: string = join(rootDir, 'icons');

/** Default color used if a color array in `colors.json` is empty. */
const defaultColor: string = '#2980b9';


/**
 * Computes the width of a language code text in the SVG image
 * using the character widths from file `widths.ts`.
 * @param code Language code.
 * @returns Width in pixels.
 */
function computeTextWidth(code: string): number {
  let width = 0;
  code.split('').forEach((character) => {
    character = character.toUpperCase();
    if (widths[character]) {
      width += widths[character];
    }
  });
  return width;
}


/**
 * Computes the left margin of a language code text in the SVG image
 * for centering the code in the SVG image.
 * @param code Language code.
 * @returns Left margin in pixels.
 */
function computeLeftMargin(code: string): number {
  const totalWidth = 128;
  const width = computeTextWidth(code);
  return Math.floor((totalWidth - width) / 2);
}


/**
 * Reads the content of a file.
 * @param fileName A file name (and path) relative to the directory containing this script file.
 * @returns An asynchronous promise returning the file content as string.
 */
function readFile(fileName: string): Promise<string> {
  return fs.promises.readFile(join(rootDir, fileName), 'utf8');
}


/**
 * Writes the content of a file.
 * @param directory Path of a directory in which the file should be written.
 *                  If this directory does not exist, it is created.
 * @param fileName Name of the written file within the given `directory`.
 * @param data File content as string.
 * @returns An asynchronous promise waiting for the file to be written.
 */
function writeFile(directory: string, fileName: string, data: string): Promise<void> {
  // Create language icon file directory if it does not exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return fs.promises.writeFile(join(directory, fileName), data, 'utf8');
}


/**
 * Writes a language icon SVG file.
 * @param code Language code.
 * @param data Content of the SVG file as string.
 * @returns An asynchronous promise waiting for the file to be written.
 */
function writeIcon(code: string, data: string): Promise<void> {
  return writeFile(iconsDir, `${code}.svg`, data);
}


/**
 * Generates and writes a language icon SVG file.
 * @param code Language code.
 * @param templates Array of all template SVG file contents
 *                  (`[one-color.svg, two-colors.svg, three-colors.svg]`).
 * @returns An asynchronous promise waiting for the file to be written
 *          and returning the SVG file content as string.
 */
async function generateIcon(code: string, templates: string[]): Promise<string> {
  // Choose a template file based on the number of colors
  const languageColors: string[] = colors[code];
  const templateData: string = templates[languageColors.length ? languageColors.length - 1 : 1];

  // Check color contrast between the language colors and the text color (white).
  // Add black stroke to text, if language icon contains white color.
  let addFontStroke: boolean = false;
  for (const color of languageColors) {
    if (color.toLowerCase() == '#ffffff') {
      addFontStroke = true;
      break;
    }
  }

  // Replace language code text, margin and colors in the template file
  let data: string = templateData
    .replace('LANGUAGE_CODE', code.toUpperCase())
    .replace(`x="20"`, `x="${computeLeftMargin(code)}"`)
    .replace('COLOR_1', languageColors.length ? languageColors[0] : defaultColor)
    .replace('COLOR_2', languageColors[1])
    .replace('COLOR_3', languageColors[2]);
  if (addFontStroke) {
    data = data.replace('<text ', '<text stroke="#000000" stroke-width="1" ');
  }

  // Write icon file
  await writeIcon(code, data);

  //console.log(`- ${code}.svg generated${addFontStroke ? ' (with text stroke for better contrast)' : ''}`);
  console.log(`- ${code}.svg generated`);

  return data.trim();
}


/**
 * Generates all language icons.
 * @returns An asynchronous promise waiting for all files to be written.
 */
async function generateAllIcons(): Promise<void> {
  try {
    console.log(`Generating ${Object.keys(colors).length} language icons...`);

    // Read template files
    const templates: string[] = await Promise.all([
      readFile('one-color.svg'),
      readFile('two-colors.svg'),
      readFile('three-colors.svg'),
    ]);

    // Generate all language icons
    const svgData: { [code: string]: string } = {};
    await Promise.all(
      Object.keys(colors).map(async (code: string) => {
        svgData[code] = await generateIcon(code, templates);
      }),
    );
    console.log('All language icons are generated!');
    console.log();

    const tsFileContent = '/**\n' +
      ' * Dictionary of language icons.\n' +
      ' * The key of each entry is the two character ISO 639 language code\n' +
      ' * and the value is the language icon SVG code.\n' +
      ' *\n' +
      ' * Generated by: https://github.com/heinerwalter/language-icons\n' +
      ' */\n' +
      'export const languageIconsSvg: { [code: string]: string } = ' +
      JSON.stringify(svgData, undefined, 2) + ';';
    await writeFile(iconsDir, 'language-icons-svg.ts', tsFileContent);
    console.log('TypeScript file containing the SVG code of all language icons was generated!');
    console.log();

  } catch (error) {
    console.error('An error occurred while generating language icons: ' + error);
  }
}


// Run program
generateAllIcons().then();
