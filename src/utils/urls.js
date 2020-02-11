
/**
 * Checks if url contains the base page, we don't want external urls
 * @param url
 * @param page
 * @returns {boolean}
 */
function urlContainsPage(url, page){
    return url.substr(0,25).includes(page);
}

/**
 * Checks for anchors
 * @param url
 * @returns {boolean}
 */
function isUrlAnAnchor(url){
    return url.includes('#');
}

/**
 * Object
 */
module.exports = UrlUtils = {
    urlContainsPage : (url, page) => urlContainsPage(url, page),
    isUrlAnAnchor : (url) => isUrlAnAnchor(url),
};