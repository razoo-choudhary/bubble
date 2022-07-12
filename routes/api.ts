import * as express from 'express'

/**
 * All routes proceeding with /api is directed here.
 */

const Router = express.Router()

Router.get(  '/hello', (req, res) => {
    res.status(200).json({
        "status"  : "ok",
        "message" : "Yes API is working"
    })
})

module.exports = Router
