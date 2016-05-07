'use strict';

var express = require('express');
var app = express();
var uuid = require('node-uuid');
var chatClient = require('./livechatclient');

app.get('/user/chat', function(req, res) {
  var email = req.query.email;
  var name = req.query.name;
  var visitorId = uuid.v4();

  chatClient.startAgent('agent@godhelp.us', 'GodHelpUs Agent').then(function(data) {
    return chatClient.startClient(visitorId, email, name);
  }).then(function(sessionId) {
    res.send({
      secured_session_id : sessionId,
      visitor_id : visitorId
    });
  }).catch(function(error) {
    res.send(error);
  });
});

app.listen(8080);
