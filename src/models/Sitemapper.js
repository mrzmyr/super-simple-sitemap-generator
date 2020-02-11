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
        this.wait = wait ? wait : 1500;
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

        await this.page.goto(url);

        const begin = async () => {

            // BORRAR TOTS LOS QUE YA SAN PARSEJAT I MIRAR DE COM FERHO ABAIX!!
            if (this.parsedUrls.includes(url)) {
                this.removeUrlFromUrls(url);
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

            this.removeRepeatedUrls();
            this.filterUrls();
            this.removeUrlFromUrls(url);
            this.parsedUrls.push(url);
        };

        return begin();
    }
    /**
     * Remove an url from the url array
     * @param url
     */
    removeUrlFromUrls(url) {
        const index = this.urls.findIndex((element) => element === url);
        if (index !== -1) {
            this.urls.splice(index, 1);
        }
    }

    /**
     * Creates a new array without the repeated elements
     */
    removeRepeatedUrls()
    {
        this.urls =  [...new Set(this.urls)]
    }

    /**
     * Filters the urls by different conditions
     */
    filterUrls() {
        this.urls = this.urls.filter((url) => UrlUtils.urlContainsPage(url, this.baseUrls[0]) && !UrlUtils.isUrlAnAnchor(url));
    }
}

module.exports = Sitemapper;

