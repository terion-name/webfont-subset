const Fontmin = require('fontmin');
const basicSubsets = require("./subsets.json")

/**
 * @param {string[]} inputFonts - Source files, supports globing
 * @param {string} output - Destination directory
 * @param {string} text - Text with symbols fonts should be subset to
 * @param {string[]} [formats] - Additional output fonts format (besides ttf), available options: woff, woff2, eot, svg, css
 */
async function reduceText(inputFonts, output, text, formats) {
    formats = formats || ['ttf']
    inputFonts = Array.isArray(inputFonts) ? inputFonts : inputFonts
    return new Promise((resolve, reject) => {
        const fontmin = new Fontmin()
            .src(inputFonts)
            .use(Fontmin.otf2ttf())
            .use(Fontmin.svg2ttf());
        ["woff", "woff2", "eot", "svg", "css"].forEach((fmt) => {
            if (formats.includes(fmt)) {
                fontmin.use(Fontmin["ttf2" + fmt]())
            }
        })
        fontmin.use(Fontmin.glyph({text: text}))
            .dest(output)
            .run((err, files) => err ? reject(err) : resolve(files))
    })
}

/**
 * @param {string[]} inputFonts - Source files, supports globing
 * @param {string} output - Destination directory
 * @param {string[]} subsets - Text with symbols fonts should be subset to
 * @param {string[]} [formats] - Additional output fonts format (besides ttf), available options: woff, woff2, eot, svg, css
 */
async function reduceSubsets(inputFonts, output, subsets, formats) {
    subsets = Array.isArray(subsets) ? subsets : subsets
    const text = Array.from(
        subsets.map((s) => {
            if (basicSubsets[s]) {
                return basicSubsets[s]
            }
            console.warn("No such subset:", s)
        })
            .filter(s => s)
            .reduce((acc, cur) => (cur.forEach(v => acc.add(v)),acc), new Set)
    ).map(c => String.fromCharCode(parseInt(c, 16))).join('')
    return await reduceText(inputFonts, output, text, formats)
}

module.exports = {reduceText, reduceSubsets}