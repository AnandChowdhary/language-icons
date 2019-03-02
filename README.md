# 🌐 Language icons

[Flags are not languages](http://www.flagsarenotlanguages.com/blog/), so we shouldn't use country flags as language icons.

You can use these icons instead.

They are generated using the language's ISO 639-1 code, combined with some colors. Colors are flag-inspired. For example, green/red for [Portuguese](https://unpkg.com/language-icons/icons/pt.svg), and they fallback to blue for unknown colors. If you want to color a currently blue icon, edit the [`colors.json`](https://github.com/AnandChowdhary/language-icons/blob/master/colors.json) file and make a pull request.

Each icon is an SVG, around 300 ± 10 bytes.

## 🖼️ Usage

You can use a CDN like Unpkg to embed a flag icon:

```
https://unpkg.com/language-icons/icons/LANGUAGE_CODE.svg
```

In HTML, for example:

```html
<img alt="English" src="https://unpkg.com/language-icons/icons/en.svg">
```

Icons are also available on NPM:

```bash
npm install language-icons
```

They are in the `./icons` folder, you can use an SVG loader to import them:

```js
import English from "./node_modules/language-icons/icons/en.svg"
```

## ⭐ Why

![Example of flags versus language icons](https://raw.githubusercontent.com/AnandChowdhary/language-icons/master/example.png)

## 🎨 Icons

See the list of icons: https://unpkg.com/language-icons@0.2.0/icons/

![English](https://unpkg.com/language-icons/icons/en.svg)
![Hindi](https://unpkg.com/language-icons/icons/hi.svg)
![Portuguese](https://unpkg.com/language-icons/icons/pt.svg)
![German](https://unpkg.com/language-icons/icons/de.svg)
![French](https://unpkg.com/language-icons/icons/fr.svg)
![Chinese](https://unpkg.com/language-icons/icons/zh.svg)
![Spanish](https://unpkg.com/language-icons/icons/es.svg)
![Dutch](https://unpkg.com/language-icons/icons/nl.svg)
![Urdu](https://unpkg.com/language-icons/icons/ur.svg)
![](https://unpkg.com/language-icons/icons/tw.svg)
![](https://unpkg.com/language-icons/icons/sl.svg)
![](https://unpkg.com/language-icons/icons/jv.svg)

## ⚒️ Building

Install Typescript dependencies and build icons using the `npm run build` command.

## 📝 License

Icons and code, both MIT
