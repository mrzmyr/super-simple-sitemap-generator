/* eslint-disable no-console */
const program = require('commander');
const pkg = require('../package.json');
const url = require("url");
const Sitemapper = require("./models/Sitemapper");

let urlsToParse = [];
let urlsAlreadyParsed = [];
let browser;

/**
 * Command line tooling
 */
program
    .version(pkg.version)
    .usage('[options] <url>')
    .option('--wait <miliseconds>', 'specify the time to wait before starting to parse the page (for CSR pages) (default 1500)', 1500)
    .option('--no-deep <boolean>', 'blocks the iterators so only parses main urls, and not the ones found inside of them', false);


program.on('--help', () => {
    console.log(`
  Example:
    sitemap --w 2500 https://localhost:3000
`)
});

program.parse(process.argv);

/**
 * @returns {Promise<void>}
 */
async function run() {

    if (program.args.length < 1) {
        throw 'One parameter (url to parse) is required. For more info write sitemap --help.';
    }

    const mapper = new Sitemapper(program.w, ...program.args);
    await mapper.init();

    await Promise.all(mapper.baseUrls.map(async url => {
            try {
                await mapper.parse(url);
            } catch (error) {
                mapper.errors.push(`${url} could not be parsed`)
            }
        })
    );

    if (mapper.errors.length) {
        console.error(mapper.errors.join('. '));
        process.exit(2);
    }

    while(mapper.urls.length !== 0){
        console.log( mapper.urls.length);
        await mapper.parse(mapper.urls[0]);
    }

    // while (mapper.urls.length !== 0) {
    //     await Promise.all(mapper.urls.map(async url => {
    //             try {
    //                 await mapper.parse(url);
    //                 console.log(mapper.parsedUrls)
    //                 console.log(mapper.urls)
    //
    //             } catch (error) {
    //                 mapper.removeUrlFromUrls(url);
    //                 mapper.errors.push(`${url} could not be parsed`)
    //             }
    //         })
    //     );
    //
    // }

    if (mapper.errors.length) {
        console.error(mapper.errors.join('. '));
        process.exit(2);
    }

    process.exit(1);
}


run().catch(error => {
    setTimeout(() => {
        console.log(error)
    })
});