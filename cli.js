const path = require('path');
const mkdirp = require('mkdirp');
const subsetter = require("./index")
const { program } = require('commander');
const html2text = require('html-to-text');

program
    .name('webfont-subset')
    .command('subset')
    .description('Reduce fonts to specified subsets')
    .requiredOption('-i, --input <string...>', 'Source files, supports globing')
    .requiredOption('-o, --output <string>', 'Destination directory')
    .option('-f, --format <string...>', 'Additional output formats, besides ttf, available options: woff, woff2, eot, svg, css')
    .requiredOption('-s, --subset <string...>', 'Target subsets')
    .action(async (opts) => {
        opts.input = opts.input.map(p => path.resolve(process.cwd(), p))
        opts.output = path.resolve(process.cwd(), opts.output)
        await mkdirp(opts.output)
        await subsetter.reduceSubsets(opts.input, opts.output, opts.subset, opts.format)
    });

program
    .command('text')
    .description('Reduce fonts to meet chars in text')
    .requiredOption('-i, --input <string...>', 'Source files, supports globing')
    .requiredOption('-o, --output <string>', 'Destination directory')
    .option('-f, --format <string...>', 'Additional output formats, besides ttf, available options: woff, woff2, eot, svg, css')
    .option('-t, --text string', 'Target text: use an argument or pipe in')
    .option('-h, --html', 'Treat input as html: will clear out tags and extract text')
    .action(async (opts) => {
        opts.input = opts.input.map(p => path.resolve(process.cwd(), p))
        opts.output = path.resolve(process.cwd(), opts.output)
        await mkdirp(opts.output)
        if (!opts.text) {
            opts.text = await new Promise((resolve, reject) => {
                const tm = setTimeout(() => {
                    console.error("Provide -t option or pipe text in")
                    process.exit(-1)
                }, 500)
                const stdin = process.openStdin();
                let data = "";
                stdin.on('data', chunk => data += chunk);
                stdin.on('end', () => (clearTimeout(tm), resolve(data.toString())));
            })
        }
        if (opts.html) {
            opts.text = html2text.convert(opts.text)
        }
        // reduce to unique symbols
        opts.text = Array.from(new Set(opts.text.split('')))

        await subsetter.reduceText(opts.input, opts.output, opts.text, opts.format)
    });

program.parseAsync(process.argv)