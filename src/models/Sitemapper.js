const puppeteer = require('puppeteer');
const timeout = require('../utils/timeout');
const UrlUtils = require('../utils/urls');

/**
 *
 */
class Sitemapper {

    /**
     * @param wait number
     * @param urls array
     */
    constructor(wait, ...urls) {
        /**
         * @type {*[]} of urls
         */
        this.baseUrls = [urls[0]];
        /**
         * Contains props with arrays of all urls found under that base url
         */
        this.urls = [urls[0]];
        /**
         * Runtime parsed urls
         */
        this.parsedUrls = [];
        /**
         * Milliseconds to wait on each parse for fetches and so to complete
         */
        this.wait = wait;
        /**
         * puppeteer current open page
         * @type {null}
         */
        this.page = null;
        this.browser;
        /**
         * Current page being parsed
         * @type {null}
         */
        this.currentPage = null;
        /**
         * All errors found during parse
         * @type {*[]}
         */
        this.errors = [];
    }

    /**
     * Creates puppeteer "session"
     * @returns {Promise<void>}
     */
    async init() {
        this.browser = await puppeteer.launch();
    }

    /**
     * Parses all the urls
     * @returns {Promise<?Puppeteer.Response>}
     */
    async parse(url) {
        this.page = await this.browser.newPage();
        console.log(url)
        await this.page.goto(url);
        console.log(this.page)

        const doit = async () => {

            if (this.parsedUrls.includes(url)) {
                this.urls.splice(1, 0, url);
                return;
            }

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
            ), ...this.urls];

            this.filterUrls();
            this.removeUrlFromUrls(url);
            this.parsedUrls.push(url);
        };

        return doit();
    }

    removeUrlFromUrls(url) {
        const index = this.urls.findIndex((element) => element === url);
        if (index !== -1) {
            this.urls.splice(index, 1);
        }
    }

    filterUrls() {
        this.urls = UrlUtils.filterUrls(UrlUtils.removeDuplicatedUrls(this.urls), this.baseUrls[0])
    }
}

module.exports = Sitemapper;

