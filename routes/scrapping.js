const express = require('express')
const router = express.Router()
const scrappingController = require('../controllers/scrappingController')

router.post('/meta', scrappingController.scrapeMetaTags)

module.exports = router