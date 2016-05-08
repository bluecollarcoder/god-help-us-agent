var request = require('request');
var Q = require('q');

module.exports = {
  'sendMessage' : function(sender, message) {
    var senderName = (typeof sender === 'object') ? sender.name : sender;
    var payload = {
      "channel": "#support",
      "username": senderName,
      "icon_emoji": ':grey_question:',
      "text": message
    };
    return doSend(payload);
  },
  'sendAlert' : function(sender, message) {
    var senderName = (typeof sender === 'object') ? sender.name : sender;
    var payload = {
      "channel": "#support",
      "username": senderName,
      "icon_emoji": ':exclamation:',
      "attachments": [
        {
          "pretext": "Sentiment has changed",
          "text": message,
          "color": "danger",
          "mrkdwn_in": [
              "text",
              "pretext"
          ]
        }
      ]
    };
    return doSend(payload);
  }
};

var doSend = function(payload) {
  var url = 'https://hooks.slack.com/services/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';
  var data = {
    "payload": JSON.stringify(payload)
  };
  var deferred = Q.defer();
  request.post({
    url: url,
    formData: data
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      deferred.resolve();
    } else {
      deferred.reject(error);
    }
  });
  return deferred.promise;
};
