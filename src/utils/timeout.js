/**
 * Creates a sugar seTimeout with promise syntax
 * @param ms
 * @returns {Promise<*>}
 */
async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = timeout;