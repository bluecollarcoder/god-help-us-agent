var _ = require('underscore');
var uuid = require('node-uuid');
var Q = require('q');
var MessageProcessor = require('./messageprocessor');
var SlackClient = require('./slackclient');

var ChatMessage = function(sender, message) {
  this.id = uuid.v4();
  this.sender = sender;
  this.message = message;
  this.timestamp = new Date();
};
ChatMessage.prototype.constructor = Object.create(ChatMessage.prototype);

var ChatSession = function() {
  this.id = uuid.v4();
  this.agent = null;
  this.user = null;
  this.messages = [];
  this.meta = {};
};
ChatSession.prototype.constructor = Object.create(ChatSession.prototype);

ChatSession.prototype.filterMessagesBySender = function(sender) {
  return _.filter(this.messages, function(message) {
    return message.sender == sender;
  });
};

var chat = new ChatSession();

module.exports = {
  'addUser' : function(user) {
    chat.user = user;
    console.log(chat);
  },
  'addAgent' : function(agent) {
    chat.agent = agent;
    console.log(chat);
  },
  'getChat' : function() {
    return chat;
  },
  'sendMessage' : function(sender, message) {
    var chatMsg = new ChatMessage(sender, message);
    chat.messages.push(chatMsg);

    if (sender == chat.user) {
      SlackClient.sendMessage(sender, message);

      var senderMessages = chat.filterMessagesBySender(sender);
      MessageProcessor.analyze(senderMessages).then(function(meta) {
        chat.meta = meta;
      }).catch(function(err) {
        console.log(err);
      });
    }

    return _.pick(chatMsg, 'id', 'timestamp', 'message');
  }
};
