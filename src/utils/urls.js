
/**
 * Filters our urlsToParse
 */
function filterUrls(urls, page){
    return urls.filter(url => {
        return urlContainsPage(url, page) && !isUrlAnAnchor(url);
    })
}

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
 * Removes duplicated urls
 */
function removeDuplicatedUrls($urls)
{
    return [...new Set($urls)]
}

/**
 * Object
 */
module.exports = UrlUtils = {
    filterUrls : ($urls) => filterUrls($urls),
    removeDuplicatedUrls : ($urls) => removeDuplicatedUrls($urls),
    urlContainsPage : ($url) => urlContainsPage($url),
    isUrlAnAnchor : ($url) => isUrlAnAnchor($url),
};