/* eslint-disable no-console */

const program = require('commander');
const pkg = require('../package.json');
const fs = require('fs');
const url = require("url");
const UrlUtils = require("./utils/urls");
const Sitemapper = require("./models/Sitemapper");

let base_page = 'http://localhost:3000/';
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
        throw 'At least one parameter (url to parse) is required. For more info write sitemap --help.';
    }

    const mapper = new Sitemapper(program.w, ...program.args);
    await mapper.init();

    await Promise.all(mapper.urls.map(async url => {
            try {
                await mapper.parse(url);
            } catch (error) {
                errors.push(`${url} could not be parsed`)
            }
        })
    );

    if (errors.length) {
        console.error(errors.join('. '));
        process.exit(2);
    }


    //console.log(site);
    /*browser = await puppeteer.launch();
    await parseUrl(base_page);
    removeDuplicatedUrls();
    filterUrls();
    for(let i = 0; i < urlsToParse.length; i++){
        console.log(urlsToParse[i]);
        await parseUrl(urlsToParse[i]);
        removeDuplicatedUrls();
        filterUrls();
        console.log(urlsAlreadyParsed)
    }

    await browser.close();*/
}

async function parseUrl(url) {
    const page = await browser.newPage();
    await page.goto(url);

    await timeout(1500);

    urlsToParse = [...await page.evaluate(() =>
        Array.from(document.querySelectorAll("a,link[rel='alternate']")).map(anchor => {
            if (anchor.href.baseVal) {
                const a = document.createElement("a");
                a.href = anchor.href.baseVal;
                return a.href;
            }
            return anchor.href;
        })
    ), ...urlsToParse];

    urlsAlreadyParsed.push(url);
}


run().catch(error => {
    setTimeout(() => {
        console.log(error)
    })
});