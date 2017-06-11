'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const schema = require('./feeds-schema');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds151141.mlab.com:${process.env.DB_PORT}/nodexperts-feed`);

const Feeds = mongoose.model('feeds', schema, 'feeds');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Express routes */
app.get('/getFeeds', (req, res) => {
  Feeds.find({}).sort({created_at: 'descending'}).exec(function(err, docs) {
    if (err) {
      return res.send('Server error in getting feeds for NodeXperts');
    }
    return res.send(docs.splice(0, 20));
  });
});

app.get('/checkForFeeds', (req, res) => {
  Feeds.find({}).sort({ created_at: 'descending' }).exec(function(err, docs) {
    if (err) {
      return res.send('Server error in getting feeds for NodeXperts');
    }
    const doc = docs[0];
    if (moment().diff(moment(doc._doc.created_at), 'minutes') < 30) {
      return res.send(docs[0]);
    }
    return res.send(true);
  });
});

app.post('/createFeed', (req, res) => {
  Feeds.create(req.body, function (err, data) {
    if (err) return res.send(err);
    res.json(data);
  });
});

/* Express routes */

module.exports = app
