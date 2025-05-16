import express from 'express';
import logger from 'morgan'; // Morgan is a widely-used middleware for Node.js and Express applications. Its primary function is to log HTTP requests, simplifying the process of monitoring and debugging
import path from 'path';
import passport from 'passport'; // Passport is a flexible and modular authentication middleware designed for Node.js, specifically compatible with Express
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSanitizer from 'express-sanitizer';
import helmet from 'helmet'; //Helmet.js is a Node.js middleware that secures web applications by setting various HTTP headers
import rfs from 'rotating-file-stream'; // The 'rotating-file-stream' module in Node.js facilitates writing to files that automatically rotate, often based on size or time
import './passport';

export default {
    setup: (config ) => {
        const app = express();

        var accessLogStream = rfs('access.log', {
            interval: '1d',
            path: path.join(__dirname, '..', 'log')
        })
        
        app.use(logger(config.app.log, { stream: accessLogStream }));

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({limit: '50mb'}));

        app.use(cookieParser(config.app.secret));
        app.use(session({ secret: config.app.secret ,resave: true, saveUninitialized:true}));
        app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(expressSanitizer());
        app.use(helmet());
        app.use(helmet.hsts({
            maxAge: 0
        }))

        Number.prototype.pad = function (size) {
            var s = String(this);
            while (s.length < (size || 2)) { s = "0" + s; }
            return s;
        }
        
        return app;
    }
}