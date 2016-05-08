var _ = require('underscore');
var uuid = require('node-uuid');
var Q = require('q');
var MessageProcessor = require('./messageprocessor');

var ChatMessage = function(sender, message, meta) {
  this.id = uuid.v4();
  this.sender = sender;
  this.message = message;
  this.timestamp = new Date();
  this.meta = meta;
};
ChatMessage.prototype.constructor = Object.create(ChatMessage.prototype);

var ChatSession = function() {
  this.id = uuid.v4();
  this.agent = null;
  this.user = null;
  this.messages = [];
};
ChatSession.prototype.constructor = Object.create(ChatSession.prototype);

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
    var deferred = Q.defer();
    MessageProcessor.analyze(message).then(function(meta) {
      var chatMsg = new ChatMessage(sender, message, meta);
      chat.messages.push(chatMsg);
      console.log(chat);
      deferred.resolve(_.pick(chatMsg, 'id', 'timestamp'));
    }).catch(function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }
};
