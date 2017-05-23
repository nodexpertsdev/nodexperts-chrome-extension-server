'use strict';

const express = require('express');
const app = express();
const FCM = require('fcm-push');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds151141.mlab.com:51141/nodexperts-feed`);
const Feeds = mongoose.model('feeds',
new Schema({ }),
'feeds');

app.get('/getFeed', (req, res) => {
    Feeds.find({}, function(err, data) {
      if (err) {
        return res.send('Server error in getting feeds for NodeXperts');
      }
      return res.send(data.splice(0, 5));
    });
});

app.io = require('socket.io')();

// [*] Configuring our Socket Connection.
app.io.on('connection', socket => {
    console.log('Huston ! we have a new connection ...');
    socket.on('new_user', (endpoint) => {
        // [*] TODO: Adding our user notification registration token to our list typically hide it in a secret place. like a DB
        //           or some secure server because this information is critical to you users.
    });

    socket.on('pushme', (data) => {
      var serverKey = '';
      var fcm = new FCM(process.env.FCM_SERVER_KEY);
        var message = {
            to: data.endpoint, // required fill with device token or topics
            notification: {
                title: data.payload.title,
                body: data.payload.body
            }
        };

        fcm.send(message)
            .then(function(response) {
                //TODO : Implement success mechanism
            })
            .catch(function(err) {
                //TODO : implement error handling mechanism
            })
    });

});


module.exports = app
