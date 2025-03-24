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
function read(fileName: string): Promise<string> {
  return fs.promises.readFile(join(rootDir, fileName), 'utf8');
}


/**
 * Writes a language icon SVG file.
 * @param code Language code.
 * @param data Content of the SVG file as string.
 * @returns An asynchronous promise waiting for the file to be written.
 */
function writeIcon(code: string, data: string): Promise<void> {
  // Create language icon file directory if it does not exist
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
  }

  return fs.promises.writeFile(join(iconsDir, `${code}.svg`), data);
}


/**
 * Generates and writes a language icon SVG file.
 * @param code Language code.
 * @param templates Array of all template SVG file contents
 *                  (`[one-color.svg, two-colors.svg, three-colors.svg]`).
 * @returns An asynchronous promise waiting for the file to be written.
 */
async function generateIcon(code: string, templates: string[]): Promise<void> {
  // Choose a template file based on the number of colors
  const templateData: string = templates[colors[code].length ? colors[code].length - 1 : 1];
  // Replace language code text, margin and colors in the template file
  const data: string = templates[colors[code].length ? colors[code].length - 1 : 1]
    .replace('LANGUAGE_CODE', code.toUpperCase())
    .replace(`x="20"`, `x="${computeLeftMargin(code)}"`)
    .replace('COLOR_1', colors[code].length ? colors[code][0] : defaultColor)
    .replace('COLOR_2', colors[code][1])
    .replace('COLOR_3', colors[code][2]);
  // Write icon file
  await writeIcon(code, data);

  console.log(`- ${code}.svg generated`);
}


/**
 * Generates all language icons.
 * @returns An asynchronous promise waiting for all files to be written.
 */
async function main(): Promise<void> {
  try {
    console.log(`Generating ${Object.keys(colors).length} language icons...`);

    // Read template files
    const templates: string[] = await Promise.all([
      read('one-color.svg'),
      read('two-colors.svg'),
      read('three-colors.svg'),
    ]);

    // Generate all language icons
    await Promise.all(
      Object.keys(colors).map((code: string) => generateIcon(code, templates)),
    );
    console.log('All language icons are generated!');

  } catch (error) {
    console.error('An error occurred while generating language icons: ' + error);
  }
}


// Run program
main().then();
