const cors = require('cors')({origin: true})

const cheerio =  require('cheerio')
const getUrls = require('get-urls')
const fetch = require('node-fetch')
const puppeteer = require('puppeteer')

const scrappingController = {}

scrappingController.scrapeMetaTags = (req, res) => {

    const urls = Array.from(getUrls(req.body.text))

    const requests = urls.map(async url => {
        const res = await fetch(url)

        const html = await res.text()
        const $ = cheerio.load(html)

        const getMetatag = (name) => {
            return $(`meta[name=${name}]`).attr('content') ||
            $(`meta[property="og:${name}"]`).attr('content') || 
            $(`meta[property="twitter:${name}"]`).attr('content')
        }

        return {
            url, 
            title: $('title').text(), 
            favicon: $('link[rel="shortcut icon"]').attr('href'), 
            // description: $('meta[name=description]').attr('content')
            description: getMetatag('description'),
            image: getMetatag('image'), 
            author: getMetatag('author'), 

        }
    })

    const result = Promise.all(requests)
        .then((values) => {
            return res.status(200).json({
                success: true, 
                data: values
            })
        })
        .catch(err => {
            return res.status(500).json({
                success: false, 
                err: err
            })
        })
}



module.exports = scrappingController