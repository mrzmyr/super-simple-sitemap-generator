/* eslint-disable no-console */

const program = require('commander');
const pkg = require('../package.json');
const fs = require('fs');
const url = require("url");
const UrlUtils = require("./utils/urls");
const Sitemapper = require ("./models/Sitemapper");

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
    .option('--w <miliseconds>', 'specify the time to wait before starting to parse the page (for CSR pages) (default 1500)','1500')

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
    // Check for params
    if(program.args.length < 1) {
        throw 'At least one parameter (url to parse) is required. For more info write sitemap --help.';
    }
    // Instantiate the class that does the hard work
    const mapper = new Sitemapper(program.w, ...program.args);
    await mapper.init();
    await mapper.parse().catch((error) => {
        throw error
    });

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

async function parseUrl(url){
    const page = await browser.newPage();
    await page.goto(url);

    await timeout(1500);

    urlsToParse = [ ...await page.evaluate(() =>
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