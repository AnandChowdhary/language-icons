/**
 * These are the approximate character widths in pixels
 * of glyphs in Arial, 64px, calculated by going to an
 * about:blank page and writing this in the console:
 * document.body.style = "font-family: Arial; font-size: 64px; margin: 30px"; "QWERTYUIOPASDFGHJKLZXCVBNM".split("").forEach(key => { document.body.innerHTML = ""; document.body.innerHTML = `<span>${key}</span>`; console.log(key, document.querySelector("span").offsetWidth); });
 */
export const widths = {
  Q: 50,
  W: 60,
  E: 43,
  R: 46,
  T: 39,
  Y: 43,
  U: 46,
  I: 18,
  O: 50,
  P: 43,
  A: 43,
  S: 43,
  D: 46,
  F: 39,
  G: 50,
  H: 46,
  J: 32,
  K: 43,
  L: 36,
  Z: 39,
  X: 43,
  C: 46,
  V: 43,
  B: 43,
  N: 46,
  M: 53
};
