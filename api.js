'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds151141.mlab.com:${process.env.DB_PORT}/nodexperts-feed`);
const Feeds = mongoose.model('feeds',
new Schema({ }),
'feeds');

/* Express routes */
app.get('/getFeed', (req, res) => {
  Feeds.find({}).sort({created_at: 'descending'}).exec(function(err, docs) {
    if (err) {
      return res.send('Server error in getting feeds for NodeXperts');
    }
    return res.send(docs.splice(0, 5));
  });
});

app.get('/sendNot', (req, res) => {
  var gcm = require('node-gcm');

  var message = new gcm.Message({
      collapseKey: 'demo',
      priority: 'high',
      contentAvailable: true,
      delayWhileIdle: true,
      timeToLive: 3,
      data: {
          key1: 'message1',
          key2: 'message2'
      },
      notification: {
          title: "Hello, World",
          icon: "ic_launcher",
          body: "This is a notification that will be displayed if your app is in the background."
      }
  });

  // // Change the message data
  // // ... as key-value
  // message.addData('key1','message1');
  // message.addData('key2','message2');
  //
  // // ... or as a data object (overwrites previous data object)
  // message.addData({
  //     key1: 'message1',
  //     key2: 'message2'
  // });

  // Set up the sender with you API key
  var sender = new gcm.Sender(process.env.FCM_SERVER_KEY);

  // Add the registration tokens of the devices you want to send to
  var registrationTokens = [];
  registrationTokens.push(process.env.TEST_DEVICE_REG_ID);

  sender.send(message, { registrationTokens: registrationTokens }, 2, function(err, response) {
    if(err) console.error('err', err);
    else    console.log(response);
  });
});
/* Express routes */

module.exports = app
