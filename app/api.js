'use strict';

var express = require('express');
var app = express();
var uuid = require('node-uuid');
var _ = require('underscore');
var State = require('./state');

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

app.listen(8080);
