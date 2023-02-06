# Simple tool for converting and subsetting web fonts
Based on [fontmin](https://www.npmjs.com/package/fontmin)

## Adding to a project
```shell
yarn add webfont-subset
npx webfont-subset # for help
```
Commands:
```shell
npx webfont-subset subset --help

Usage: webfont-subset subset [options]

Reduce fonts to specified subsets

Options:
  -i, --input <string...>   Source files, supports globing
  -o, --output <string>     Destination directory
  -f, --format <string...>  Additional output formats, besides ttf, available options: woff, woff2, eot, svg, css
  -s, --subset <string...>  Target subsets
  -h, --help                display help for command
```
```shell
npx webfont-subset text --help

Usage: webfont-subset text [options]

Reduce fonts to meet chars in text

Options:
  -i, --input <string...>   Source files, supports globing
  -o, --output string       Destination directory
  -f, --format <string...>  Additional output formats, besides ttf, available options: woff, woff2, eot, svg, css
  -t, --text string         Target text: use an argument or pipe in
  -h, --html                Treat input as html: will clear out tags and extract text
  --help                    display help for command
```
Example:
```shell
npx webfont-subset subset -s english -i ./src/fonts/* -o ./dist/fonts
```
To use programmatically:
```js
const {reduceText, reduceSubsets} = require('webfont-subset')
await reduceText(inputFonts, output, text, formats)
await reduceSubsets(inputFonts, output, subsets, formats)
```

# As a cli tool
```shell
npm i -g webfont-subset
webfont-subset subset -s english -i ./src/fonts/* -o ./dist/fonts
```

See available subsets in  `subsets.json`