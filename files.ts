import * as fs from "fs";
import * as path from "path";

export const read = (fileName: string) =>
  new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "..", fileName), (error, data) => {
      if (error) return reject(error);
      resolve(data.toString());
    });
  });

export const write = (fileName: string, data: string) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, "..", "icons", fileName), data, error => {
      if (error) return reject(error);
      resolve();
    });
  });
