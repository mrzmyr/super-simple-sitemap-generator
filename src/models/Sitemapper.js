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
        this.errors = [];
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
     * @returns {Promise<?Puppeteer.Response>}
     */
    async parse(url)
    {
        return this.page.goto(url).then( async () => {
            await timeout(this.wait);
            this.urls = [...await this.page.evaluate(() =>
                Array.from(document.querySelectorAll("a,link[rel='alternate']")).map(anchor => {
                    if (anchor.href.baseVal) {
                        const a = document.createElement("a");
                        a.href = anchor.href.baseVal;
                        return a.href;
                    }
                    return anchor.href;
                })
            ), ...this.urls]
        });
    }

}

module.exports = Sitemapper;

