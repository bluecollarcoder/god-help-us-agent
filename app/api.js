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

app.post('/chat/user', function(req, res) {
  var email = req.body.email;
  var name = req.body.name;
  var id = uuid.v4();

  if (email && name) {
    var user = new User({
      name : name,
      email : email,
      id : id
    });
    State.addUser(user);
    res.send(user);
  } else {
    res.status(500).send({ error: 'Name or email missing!' });
  }
});

app.post('/chat/agent', function(req, res) {
  var email = req.body.email;
  var name = req.body.name;
  var id = uuid.v4();

  if (email && name) {
    var agent = new Agent({
      name : name,
      email : email,
      id : id
    });
    State.addAgent(agent);
    res.send(agent);
  } else {
    res.status(500).send({ error: 'Name or email missing!' });
  }
});

app.get('/chat/messages', function(req, res) {
  var chat = State.getChat();
  var filtered;
  if (req.query.start) {
    var start = new Date(req.query.start);
    filtered = _.filter(chat.messages, function(message) {
      return message.timestamp.getTime() > start.getTime();
    });
  } else {
    filtered = chat.messages;
  }

  res.send(filtered);
});

app.get('/chat/meta', function(req, res) {
  var chat = State.getChat();
  res.send(chat.meta);
});

app.post('/chat/agent/message', function(req, res) {
  var message = req.body.message;
  if (message) {
    var chat = State.getChat();
    var agent = chat.agent;
    res.send(State.sendMessage(agent, message));
  } else {
    res.status(500).send({ error: 'Message missing!' });
  }
});

app.post('/chat/user/message', function(req, res) {
  var message = req.body.message;
  if (message) {
    var chat = State.getChat();
    var user = chat.user;
    res.send(State.sendMessage(user, message));
  } else {
    res.status(500).send({ error: 'Message missing!' });
  }
});

app.post('/chat/slack/message', function(req, res) {
  var message = req.body.text;
  if (message) {
    message = message.replace(/^[a-zA-Z0-9]*\:\s*/, '');
    var chat = State.getChat();
    var agent = chat.agent;
    res.send(State.sendMessage(agent, message));
  } else {
    res.status(500).send({ error: 'Message missing!' });
  }
});

app.listen(8080);

// Initialize with default agent.
var defaultAgent = new Agent({
  name : 'Super Agent',
  email : 'super.agent@gmail.com',
  id : uuid.v4()
});
State.addAgent(defaultAgent);
