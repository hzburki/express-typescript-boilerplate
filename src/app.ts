import * as path from 'path';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as monitor from 'express-status-monitor';
import { Bootstrap } from './core/Bootstrap';
import { Log } from './core/log';
import container from './container';

/**
 * APPLICATION CONFIGURATION
 * ----------------------------------------
 * This is the place to add any other express module and register
 * all your custom middlewares and routes
 */
const app = Bootstrap.getApp()
    // Report realtime server metrics for Express-based node servers
    .use(monitor())

    // Enabling the cors headers
    .options('*', cors())
    .use(cors())

    // Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
    .use(helmet())
    .use(helmet.noCache())
    .use(helmet.hsts({
        maxAge: 31536000,
        includeSubdomains: true
    }))

    // Compress response bodies for all request that traverse through the middleware
    .use(compression())

    // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))

    // Serve static filles like images from the public folder
    .use(express.static(`${__dirname}/public`, { maxAge: 31557600000 }))

    // A favicon is a visual cue that client software, like browsers, use to identify a site
    .use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

    // HTTP request logger middleware for node.js
    .use(morgan('dev', {
        stream: {
            write: Log.info
        }
    }));


export default Bootstrap.build(app, container);
