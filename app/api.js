'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var uuid = require('node-uuid');
var _ = require('underscore');
var State = require('./state');

app.use(bodyParser.urlencoded({ extended: false }));

var User = function(obj) {
  _.extend(this, obj);
  return this;
};
User.prototype.constructor = Object.create(User.prototype);

var Agent = function(obj) {
  _.extend(this, obj);
  return this;
};
Agent.prototype.constructor = Object.create(Agent.prototype);

app.get('/chat/user', function(req, res) {
  var email = req.query.email;
  var name = req.query.name;
  var id = uuid.v4();

  var user = new User({
    name : name,
    email : email,
    id : id
  });
  State.addUser(user);
  res.send(user);
});

app.get('/chat/agent', function(req, res) {
  var email = req.query.email;
  var name = req.query.name;
  var id = uuid.v4();

  var agent = new Agent({
    name : name,
    email : email,
    id : id
  });
  State.addAgent(agent);
  res.send(agent);
});

app.get('/chat/messages', function(req, res) {
  var chat = State.getChat();
  res.send(chat.messages);
});

app.post('/chat/user/message', function(req, res) {
  var message = req.body.message;
  var chat = State.getChat();

  var user = chat.user;
  var chatMsg = State.sendMessage(user, message);
  res.send(chatMsg);
});

app.post('/chat/agent/message', function(req, res) {
  var message = req.body.message;
  var chat = State.getChat();

  var agent = chat.agent;
  var chatMsg = State.sendMessage(agent, message);
  res.send(chatMsg);
});

app.post('/chat/user/message', function(req, res) {
  var message = req.body.message;
  var chat = State.getChat();

  var user = chat.user;
  var chatMsg = State.sendMessage(user, message);
  res.send(chatMsg);
});

app.listen(8080);
