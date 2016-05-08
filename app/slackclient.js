var request = require('request');
var Q = require('q');
var _ = require('underscore');

module.exports = {
  'sendMessage' : function(sender, message) {
    var senderName = (sender != null && typeof sender === 'object') ? sender.name : sender;
    var payload = {
      "channel": "#support",
      "username": senderName,
      "icon_emoji": ':grey_question:',
      "text": message
    };
    return doSend(payload);
  },
  'sendAlert' : function(sender, message, suggestedResponses) {
    var senderName = (sender != null && typeof sender === 'object') ? sender.name : sender;
    var payload = {
      "channel": "#support",
      "username": senderName,
      "icon_emoji": ':exclamation:',
      "attachments": []
    };
    populateAttachments(payload, message, suggestedResponses);
    return doSend(payload);
  }
};

var populateAttachments = function(payload, message, suggestedResponses) {
  if (suggestedResponses) {
    var formatted = _.map(suggestedResponses, function(response, index) {
      return (index + 1) + '. ' + response;
    }).join('\n');
    payload.attachments.push({
      "title": "Suggested responses",
      "pretext": message,
      "text": formatted,
      "mrkdwn_in": [
        "text",
        "pretext"
      ]
    });
  } else {
    payload.attachments.push({
      "pretext": message,
      "mrkdwn_in": [
          "text",
          "pretext"
      ]
    });
  }
  return payload;
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
