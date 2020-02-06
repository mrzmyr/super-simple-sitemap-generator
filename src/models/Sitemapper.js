const puppeteer = require('puppeteer');
const timeout = require('../utils/timeout');

/**
 *
 */
class Sitemapper {

    /**
     * @param wait number
     * @param urls array
     */
    constructor(wait, ...urls) {
        this.urls = urls;
        this.wait = wait;
        this.page = null;
        this.currentPage = null;
    }

    /**
     * Creates puppeteer "session"
     * @returns {Promise<void>}
     */
    async init()
    {
        const browser = await puppeteer.launch();
        this.page = await browser.newPage();
    }

    /**
     * Parses all the urls
     * @returns {Promise<void>}
     */
    async parse()
    {
        this.filterUrls().map( async (url) => this.currentPage = await this.page.goto(url) && await this.urlFinder());
    }

    async urlFinder()
    {
        await timeout(this.wait);
        console.log(this.currentPage);
    }

    filterUrls()
    {
        return this.urls.filter(url => true)
    }

}

module.exports = Sitemapper;

