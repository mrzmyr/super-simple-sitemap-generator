<p align="center">
  <img src="https://github.com/jvidalv/node-simple-sitemap-generator/blob/master/assets/logo.png?raw=true" />
</p>

[![License](http://img.shields.io/npm/l/super-simple-sitemap-generator.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![NPM Version](http://img.shields.io/npm/v/super-simple-sitemap-generator.svg?style=flat-square)](https://npmjs.com/package/super-simple-sitemap-generator)
[![NPM Downloads](https://img.shields.io/npm/dm/super-simple-sitemap-generator.svg?style=flat-square)](https://npmjs.com/package/super-simple-sitemap-generator)


A node.js powered scrapper 🔥 that iterates trough all the internal links of the specified url.

It works on CSR pages (React, Angular) with dynamic urls.

Once it is done it generates a ``sitemap.xml`` file with all the urls found, ready to be uploaded to Google Search Console.

#### Usage:

``` bash
$ sitemap https://vvlog.dev
```

#### Params:

Parameter | type | default | description
--- | --- | --- | --- 
--wait | integer | 1500 | Specify the time to wait (So the fetches are completed) before starting to parse the page (default 1500 milliseconds).
--limit | integer | 999999 | Specify the limit of urls to parse before stopping the scrapper.

#### Todo:
* [x] Make it a NPM package.
* [ ] Make wait time dynamic in response of fetches inside url.
* [ ] New params that lets you specify how deep you want to go inside the url.
* [ ] Integrate it as part of build process of a create-react-app.
