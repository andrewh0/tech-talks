// @flow

import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import express from 'express';
import session from 'express-session';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import TwitterStrategy from 'passport-twitter';
import { first, get } from 'lodash';

import db from './models';
import App from './components/App';
import router from './router';
import indexVideos, { VIDEO_INDEX_FREQUENCY_HOURS } from './jobs/indexVideos';

import {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  EXPRESS_SESSION_SECRET
} from '../config/secrets.js';
const { User } = db;

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    (_token, _tokenSecret, profile, callback) => {
      User.findOrCreate({
        where: {
          twitterId: profile.id
        },
        defaults: {
          username: profile.username,
          displayName: profile.displayName || profile.username,
          avatar: get(profile, ['photos', 0, 'value']) || null
        }
      })
        .then(users => {
          callback(null, first(users));
        })
        .catch(error => {
          callback(error);
        });
    }
  )
);

passport.serializeUser((user, callback) => {
  callback(null, user.id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

let server = express()
  .disable('x-powered-by')
  .use(logger('short'))
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use(cookieParser())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(
    session({
      secret: EXPRESS_SESSION_SECRET,
      resave: false,
      saveUninitialized: false
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use(router)
  .get('/auth/twitter', passport.authenticate('twitter'))
  .get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: 'http://localhost:3000/failed'
    }),
    (_req, res) => {
      res.redirect('/explore');
    }
  )
  .get('/*', (req, res) => {
    const user = req.user
      ? {
          displayName: req.user.displayName,
          avatar: req.user.avatar,
          username: req.user.username
        }
      : null;

    const context = {};
    const sheet = new ServerStyleSheet();
    const markup = renderToString(
      sheet.collectStyles(
        <StaticRouter context={context} location={req.url}>
          <App user={user} />
        </StaticRouter>
      )
    );
    const styleTags = sheet.getStyleTags();

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
          <html lang="">
          <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta charset="utf-8" />
            <title>TechTalks</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${
              assets.client.css
                ? `<link rel="stylesheet" href="${assets.client.css}">`
                : ''
            }
            ${
              process.env.NODE_ENV === 'production'
                ? `<script src="${assets.client.js}" defer></script>`
                : `<script src="${
                    assets.client.js
                  }" defer crossorigin></script>`
            }
            <script>window.TECH_TALKS = ${JSON.stringify(user)}</script>
            ${styleTags}
          </head>
          <body>
            <div id="root">${markup}</div>
          </body>
        </html>`
      );
    }
  });

// Start jobs
// indexVideos();
// setInterval(indexVideos, VIDEO_INDEX_FREQUENCY_HOURS);

export default server;
