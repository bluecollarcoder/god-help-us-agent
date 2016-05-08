'use strict';

var _ = require('underscore');
var uuid = require('node-uuid');

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
    var chatMsg = new ChatMessage(sender, message);
    chat.messages.push(chatMsg);
    console.log(chat);
    return chatMsg;
  }
};
