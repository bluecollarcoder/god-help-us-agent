'use strict';

var Agent = require('./app/agent');
var Api = require('./app/api');
var State = require('./app/state');

var Runner = function() {
  Agent();
  setTimeout(Runner, 1000);
};

setTimeout(Runner, 1000);
